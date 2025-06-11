const Hapi = require("@hapi/hapi");
const axios = require("axios");

// Configuration SWAPI - Utilisation de swapi.tech car swapi.dev est en panne
const SWAPI_BASE_URL = "https://www.swapi.tech/api";
const SWAPI_CATEGORIES = [
  "people",
  "planets",
  "films",
  "species",
  "vehicles",
  "starships",
];

// Authentification simple
const validateAuth = (username, password) => {
  return username === "Luke" && password === "DadSucks";
};

// Fonction pour rechercher dans une catégorie spécifique avec swapi.tech
const searchInCategory = async (category, query) => {
  try {
    console.log(`🔍 Recherche "${query}" dans ${category}...`);

    // Récupérer tous les éléments de la catégorie
    const response = await axios.get(`${SWAPI_BASE_URL}/${category}`, {
      timeout: 10000,
      headers: {
        "User-Agent": "Rebels-Alliance-API/1.0",
      },
    });

    if (!response.data || !response.data.results) {
      console.log(`⚠️ Pas de données pour ${category}`);
      return [];
    }

    // Filtrer les résultats par nom/titre
    const filteredItems = response.data.results.filter((item) => {
      const name = item.name || item.title || "";
      return name.toLowerCase().includes(query.toLowerCase());
    });

    console.log(`✅ Trouvé ${filteredItems.length} résultats dans ${category}`);

    // Récupérer les détails pour les premiers résultats
    const detailedResults = await Promise.allSettled(
      filteredItems.slice(0, 5).map(async (item) => {
        try {
          const detailResponse = await axios.get(item.url, {
            timeout: 5000,
            headers: {
              "User-Agent": "Rebels-Alliance-API/1.0",
            },
          });

          const result = detailResponse.data.result;
          return {
            uid: result.uid,
            name: result.properties.name || result.properties.title,
            ...result.properties,
            category: category,
            type: category.slice(0, -1),
            api_url: item.url,
          };
        } catch (error) {
          console.error(`❌ Erreur détail pour ${item.url}:`, error.message);
          // Retourner au moins les infos de base
          return {
            uid: item.uid,
            name: item.name || item.title,
            category: category,
            type: category.slice(0, -1),
            api_url: item.url,
          };
        }
      })
    );

    // Retourner seulement les résultats réussis
    return detailedResults
      .filter((result) => result.status === "fulfilled")
      .map((result) => result.value);
  } catch (error) {
    console.error(
      `💥 Erreur lors de la recherche dans ${category}:`,
      error.message
    );
    return [];
  }
};

// Fonction pour rechercher dans toutes les catégories
const searchAllCategories = async (query) => {
  try {
    console.log(`🚀 Recherche globale pour: "${query}"`);

    const searchPromises = SWAPI_CATEGORIES.map((category) =>
      searchInCategory(category, query)
    );

    const results = await Promise.allSettled(searchPromises);

    // Combiner tous les résultats réussis
    const allResults = results
      .filter((result) => result.status === "fulfilled")
      .map((result) => result.value)
      .flat();

    const categoryStats = SWAPI_CATEGORIES.reduce((acc, category, index) => {
      const result = results[index];
      acc[category] = result.status === "fulfilled" ? result.value.length : 0;
      return acc;
    }, {});

    console.log(
      `✨ Recherche terminée: ${allResults.length} résultats au total`
    );

    return {
      query: query,
      totalResults: allResults.length,
      results: allResults,
      categories: categoryStats,
    };
  } catch (error) {
    console.error("💥 Erreur lors de la recherche globale:", error.message);
    throw error;
  }
};

// Fonction pour récupérer un élément spécifique par ID et catégorie
const getItemById = async (category, id) => {
  try {
    console.log(`📄 Récupération de ${category}/${id}`);

    const response = await axios.get(`${SWAPI_BASE_URL}/${category}/${id}`, {
      timeout: 10000,
      headers: {
        "User-Agent": "Rebels-Alliance-API/1.0",
      },
    });

    if (response.data && response.data.result) {
      const result = response.data.result;
      return {
        uid: result.uid,
        name: result.properties.name || result.properties.title,
        ...result.properties,
        category: category,
        type: category.slice(0, -1),
      };
    }
    return null;
  } catch (error) {
    console.error(
      `❌ Erreur lors de la récupération de ${category}/${id}:`,
      error.message
    );
    return null;
  }
};

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 3001,
    host: "localhost",
    routes: {
      cors: {
        origin: ["*"], // En production, spécifier les domaines autorisés
        credentials: true,
      },
    },
  });

  // Route de base
  server.route({
    method: "GET",
    path: "/",
    handler: (request, h) => {
      return {
        message: "🚀 Bienvenue dans l'API de l'Alliance Rebelle!",
        status: "Opérationnel - Que la Force soit avec nous!",
        apiSource: "swapi.tech (Alternative robuste à swapi.dev)",
        documentation:
          "Utilisez /search?q=votre_recherche pour chercher dans la base de données de l'Empire",
        endpoints: {
          search:
            "/search?q={query} - Recherche globale dans toutes les catégories",
          searchAuth:
            "/search?q={query}&auth={base64} - Recherche avec authentification",
          authSearch: "POST /auth/search - Recherche authentifiée",
          categories: "/categories - Liste des catégories disponibles",
          item: "/{category}/{id} - Récupération d'un élément spécifique",
        },
        examples: {
          searchLuke: "/search?q=luke",
          searchVader: "/search?q=vader",
          getPerson: "/people/1",
          getPlanet: "/planets/1",
        },
      };
    },
  });

  // Route pour lister les catégories disponibles
  server.route({
    method: "GET",
    path: "/categories",
    handler: (request, h) => {
      return {
        categories: SWAPI_CATEGORIES,
        description:
          "Catégories disponibles dans la base de données de l'Empire",
        totalCategories: SWAPI_CATEGORIES.length,
        apiSource: "swapi.tech",
      };
    },
  });

  // Route de recherche principale
  server.route({
    method: "GET",
    path: "/search",
    handler: async (request, h) => {
      try {
        const { q: query, auth } = request.query;

        // Vérification de l'authentification si fournie
        if (auth) {
          try {
            const [username, password] = Buffer.from(auth, "base64")
              .toString()
              .split(":");
            if (!validateAuth(username, password)) {
              return h
                .response({
                  error: "Authentification invalide",
                  message:
                    "Seuls les membres de l'Alliance Rebelle sont autorisés",
                  hint: "Utilisez les identifiants de Luke Skywalker",
                })
                .code(401);
            }
          } catch (authError) {
            return h
              .response({
                error: "Format d'authentification invalide",
                message:
                  "Utilisez l'encodage Base64 au format username:password",
              })
              .code(400);
          }
        }

        if (!query) {
          return h
            .response({
              error: "Paramètre de recherche manquant",
              message: 'Utilisez le paramètre "q" pour effectuer une recherche',
              example: "/search?q=luke",
            })
            .code(400);
        }

        if (query.length < 2) {
          return h
            .response({
              error: "Recherche trop courte",
              message: "La recherche doit contenir au moins 2 caractères",
            })
            .code(400);
        }

        const results = await searchAllCategories(query);

        return h
          .response({
            ...results,
            authenticated: !!auth,
            apiSource: "swapi.tech",
            timestamp: new Date().toISOString(),
          })
          .code(200);
      } catch (error) {
        console.error("💥 Erreur lors de la recherche:", error);
        return h
          .response({
            error: "Erreur interne du serveur",
            message: "Une erreur est survenue lors de la recherche",
            details: error.message,
          })
          .code(500);
      }
    },
  });

  // Route pour récupérer un élément spécifique
  server.route({
    method: "GET",
    path: "/{category}/{id}",
    handler: async (request, h) => {
      try {
        const { category, id } = request.params;

        if (!SWAPI_CATEGORIES.includes(category)) {
          return h
            .response({
              error: "Catégorie invalide",
              message: `Les catégories disponibles sont: ${SWAPI_CATEGORIES.join(
                ", "
              )}`,
              availableCategories: SWAPI_CATEGORIES,
            })
            .code(400);
        }

        const item = await getItemById(category, id);

        if (!item) {
          return h
            .response({
              error: "Élément non trouvé",
              message: `Aucun élément trouvé pour ${category}/${id}`,
              suggestion: "Vérifiez l'ID et la catégorie",
            })
            .code(404);
        }

        return h
          .response({
            ...item,
            apiSource: "swapi.tech",
            timestamp: new Date().toISOString(),
          })
          .code(200);
      } catch (error) {
        console.error("💥 Erreur lors de la récupération:", error);
        return h
          .response({
            error: "Erreur interne du serveur",
            message: "Une erreur est survenue lors de la récupération",
            details: error.message,
          })
          .code(500);
      }
    },
  });

  // Route pour la recherche avec authentification POST
  server.route({
    method: "POST",
    path: "/auth/search",
    handler: async (request, h) => {
      try {
        const { username, password, query } = request.payload;

        if (!validateAuth(username, password)) {
          return h
            .response({
              error: "Authentification échouée",
              message: "Nom d'utilisateur ou mot de passe incorrect",
              hint: "Seul Luke Skywalker peut accéder à cette fonction",
            })
            .code(401);
        }

        if (!query || query.length < 2) {
          return h
            .response({
              error: "Recherche invalide",
              message: "La recherche doit contenir au moins 2 caractères",
            })
            .code(400);
        }

        const results = await searchAllCategories(query);

        return h
          .response({
            ...results,
            authenticated: true,
            user: username,
            apiSource: "swapi.tech",
            timestamp: new Date().toISOString(),
          })
          .code(200);
      } catch (error) {
        console.error("💥 Erreur lors de la recherche authentifiée:", error);
        return h
          .response({
            error: "Erreur interne du serveur",
            message: "Une erreur est survenue lors de la recherche",
            details: error.message,
          })
          .code(500);
      }
    },
  });

  // Route de test pour vérifier la connectivité SWAPI
  server.route({
    method: "GET",
    path: "/health",
    handler: async (request, h) => {
      try {
        // Test simple de connectivité
        const response = await axios.get(`${SWAPI_BASE_URL}/people/1`, {
          timeout: 5000,
          headers: {
            "User-Agent": "Rebels-Alliance-API/1.0",
          },
        });

        return h
          .response({
            status: "healthy",
            apiSource: "swapi.tech",
            connectivity: "OK",
            testResponse: response.data.result.properties.name,
            timestamp: new Date().toISOString(),
          })
          .code(200);
      } catch (error) {
        return h
          .response({
            status: "unhealthy",
            apiSource: "swapi.tech",
            connectivity: "ERROR",
            error: error.message,
            timestamp: new Date().toISOString(),
          })
          .code(503);
      }
    },
  });

  await server.start();
  console.log(
    "🚀 Serveur de l'Alliance Rebelle démarré sur %s",
    server.info.uri
  );
};

process.on("unhandledRejection", (err) => {
  console.log("💥 Erreur non gérée:", err);
  process.exit(1);
});

init();
