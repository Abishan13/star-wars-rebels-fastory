import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  User,
  Lock,
  Loader2,
  Star,
  Users,
  Globe,
  Film,
  Zap,
  Rocket,
  Eye,
  ChevronRight,
  Shield,
  Filter,
  X,
} from "lucide-react";

const StarWarsApp = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [allData, setAllData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [activeFilter, setActiveFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const API_BASE_URL = "http://localhost:3001";

  // Debounce hook
  const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => setDebouncedValue(value), delay);
      return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
  };

  // Fonction optimisée pour charger les données via votre API backend
  const loadAllData = useCallback(async () => {
    setInitialLoading(true);
    try {
      // Stratégie optimisée : utiliser des recherches ciblées pour récupérer un maximum de diversité
      const searchStrategies = [
        // Recherches par lettres communes
        { term: "a", priority: 1 },
        { term: "e", priority: 1 },
        { term: "an", priority: 2 },
        { term: "er", priority: 2 },
        { term: "ar", priority: 2 },
        // Termes Star Wars populaires
        { term: "luke", priority: 3 },
        { term: "star", priority: 3 },
        { term: "death", priority: 3 },
        { term: "empire", priority: 3 },
        { term: "rebel", priority: 3 },
      ];

      const allResults = [];
      const seenItems = new Set();
      let requestCount = 0;
      const maxRequests = 6; // Limite pour éviter trop d'appels

      console.log("🚀 Chargement des données via l'API de recherche...");

      for (const strategy of searchStrategies) {
        if (requestCount >= maxRequests) break;

        try {
          const authHeader = isAuthenticated
            ? `&auth=${btoa(`${credentials.username}:${credentials.password}`)}`
            : "";

          console.log(`🔍 Recherche: "${strategy.term}"`);
          const response = await fetch(
            `${API_BASE_URL}/search?q=${strategy.term}${authHeader}`
          );

          if (response.ok) {
            const data = await response.json();
            requestCount++;

            if (data.results && data.results.length > 0) {
              console.log(
                `✅ Trouvé ${data.results.length} résultats pour "${strategy.term}"`
              );

              data.results.forEach((item) => {
                const itemKey = `${item.category}-${item.uid || item.name}`;
                if (!seenItems.has(itemKey)) {
                  seenItems.add(itemKey);
                  allResults.push({
                    ...item,
                    searchTerm: strategy.term, // Pour debugging
                  });
                }
              });
            }
          } else {
            console.warn(`⚠️ Échec de la recherche pour "${strategy.term}"`);
          }

          // Pause courte entre les requêtes
          await new Promise((resolve) => setTimeout(resolve, 100));
        } catch (error) {
          console.error(
            `❌ Erreur lors de la recherche "${strategy.term}":`,
            error
          );
        }
      }

      // Trier les résultats par catégorie puis par nom
      allResults.sort((a, b) => {
        if (a.category !== b.category) {
          return a.category.localeCompare(b.category);
        }
        return (a.name || a.title || "").localeCompare(b.name || b.title || "");
      });

      // Statistiques par catégorie
      const categoriesCount = allResults.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1;
        return acc;
      }, {});

      console.log("📊 Statistiques de chargement:", {
        total: allResults.length,
        categories: categoriesCount,
        requests: requestCount,
      });

      setAllData({
        query: "discovery",
        totalResults: allResults.length,
        results: allResults,
        categories: categoriesCount,
        loadedWith: `${requestCount} requêtes API`,
      });
    } catch (error) {
      console.error("💥 Erreur lors du chargement initial:", error);

      // Fallback : essayer une recherche simple
      try {
        console.log("🔄 Tentative de fallback...");
        const response = await fetch(`${API_BASE_URL}/search?q=the`);
        if (response.ok) {
          const data = await response.json();
          setAllData(data);
        }
      } catch (fallbackError) {
        console.error("💥 Fallback échoué aussi:", fallbackError);
      }
    }
    setInitialLoading(false);
  }, [isAuthenticated, credentials]);

  // Charger les données au démarrage
  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Recharger si l'authentification change
  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated, loadAllData]);

  const categoryIcons = {
    people: Users,
    planets: Globe,
    films: Film,
    species: Star,
    vehicles: Zap,
    starships: Rocket,
  };

  const categoryColors = {
    people: "from-blue-500 to-cyan-500",
    planets: "from-green-500 to-emerald-500",
    films: "from-purple-500 to-pink-500",
    species: "from-yellow-500 to-orange-500",
    vehicles: "from-red-500 to-rose-500",
    starships: "from-indigo-500 to-blue-500",
  };

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const performSearch = useCallback(
    async (query) => {
      if (!query || query.length < 2) {
        setSearchResults(null);
        return;
      }

      setLoading(true);
      try {
        const authHeader = isAuthenticated
          ? `&auth=${btoa(`${credentials.username}:${credentials.password}`)}`
          : "";

        const response = await fetch(
          `${API_BASE_URL}/search?q=${encodeURIComponent(query)}${authHeader}`
        );
        const data = await response.json();

        if (response.ok) {
          setSearchResults(data);
        } else {
          console.error("Search error:", data);
        }
      } catch (error) {
        console.error("Search failed:", error);
      }
      setLoading(false);
    },
    [isAuthenticated, credentials]
  );

  useEffect(() => {
    if (debouncedSearchQuery) {
      performSearch(debouncedSearchQuery);
    } else {
      setSearchResults(null); // Retour aux données complètes quand la recherche est vide
    }
  }, [debouncedSearchQuery, performSearch]);

  const handleAuth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password,
          query: "luke", // Test query
        }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        setShowAuth(false);
      } else {
        alert(
          "Authentification échouée. Seul Luke peut accéder à ces données."
        );
      }
    } catch (error) {
      console.error("Auth failed:", error);
    }
  };

  // Données à afficher : résultats de recherche ou toutes les données
  const currentData = searchResults || allData;

  const filteredResults = currentData
    ? activeFilter === "all"
      ? currentData.results
      : currentData.results.filter((item) => item.category === activeFilter)
    : [];

  const getItemDetails = (item) => {
    const details = [];
    const excludeFields = [
      "uid",
      "name",
      "title",
      "category",
      "type",
      "api_url",
      "url",
      "created",
      "edited",
    ];

    Object.entries(item).forEach(([key, value]) => {
      if (
        !excludeFields.includes(key) &&
        value &&
        typeof value === "string" &&
        value !== "unknown" &&
        value !== "n/a"
      ) {
        details.push({ key: key.replace(/_/g, " "), value });
      }
    });

    return details.slice(0, 8); // Limit to most important details
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-blue-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        {/* Animated stars */}
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="p-6 border-b border-gray-800/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                  Alliance Rebelle
                </h1>
                <p className="text-gray-400 text-sm">
                  Système de Recherche Impérial
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-2 px-4 py-2 bg-green-500/20 rounded-full border border-green-500/30">
                  <User className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-sm">Luke Skywalker</span>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuth(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 rounded-full border border-blue-500/30 hover:bg-blue-500/30 transition-colors"
                >
                  <Lock className="w-4 h-4" />
                  <span>Authentification</span>
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto p-6">
          {/* Search Section */}
          <div className="mb-8">
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher dans les archives de l'Empire..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:bg-gray-900/70 transition-all backdrop-blur-sm"
              />
              {(loading || initialLoading) && (
                <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5 animate-spin" />
              )}
            </div>

            {/* Filters */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-3 py-2 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:bg-gray-800/70 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  <span className="text-sm">Filtres</span>
                </button>

                {showFilters && (
                  <div className="flex items-center space-x-2 ml-4">
                    {["all", ...Object.keys(categoryIcons)].map((filter) => {
                      const Icon =
                        filter === "all" ? Star : categoryIcons[filter];
                      return (
                        <button
                          key={filter}
                          onClick={() => setActiveFilter(filter)}
                          className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs transition-all ${
                            activeFilter === filter
                              ? "bg-blue-500/30 text-blue-300 border border-blue-500/50"
                              : "bg-gray-800/30 text-gray-400 border border-gray-700/30 hover:bg-gray-700/50"
                          }`}
                        >
                          <Icon className="w-3 h-3" />
                          <span className="capitalize">
                            {filter === "all" ? "Tout" : filter}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {currentData && (
                <div className="text-sm text-gray-400">
                  {searchQuery
                    ? `${filteredResults.length} résultat${
                        filteredResults.length !== 1 ? "s" : ""
                      } pour "${searchQuery}"`
                    : `${filteredResults.length} élément${
                        filteredResults.length !== 1 ? "s" : ""
                      } au total`}
                </div>
              )}
            </div>
          </div>

          {/* Results Grid */}
          {initialLoading ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
              </div>
              <p className="text-gray-400">
                Chargement des archives de l'Empire...
              </p>
            </div>
          ) : (
            currentData &&
            !selectedItem && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResults.map((item, index) => {
                  const Icon = categoryIcons[item.category] || Star;
                  const colorClass =
                    categoryColors[item.category] ||
                    "from-gray-500 to-gray-600";

                  return (
                    <div
                      key={`${item.category}-${item.uid || index}`}
                      onClick={() => setSelectedItem(item)}
                      className="group bg-gray-900/30 backdrop-blur-sm border border-gray-700/30 rounded-xl p-6 hover:bg-gray-800/50 hover:border-gray-600/50 cursor-pointer transition-all duration-300 hover:scale-105"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={`w-12 h-12 bg-gradient-to-r ${colorClass} rounded-lg flex items-center justify-center`}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                      </div>

                      <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-300 transition-colors">
                        {item.name || item.title}
                      </h3>

                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs px-2 py-1 bg-gradient-to-r ${colorClass} rounded-full text-white capitalize`}
                        >
                          {item.category.slice(0, -1)}
                        </span>
                        <Eye className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}

          {/* Detail View */}
          {selectedItem && (
            <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-700/30 rounded-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                  <span>Retour aux résultats</span>
                </button>

                <div
                  className={`px-3 py-1 bg-gradient-to-r ${
                    categoryColors[selectedItem.category]
                  } rounded-full text-white text-sm capitalize`}
                >
                  {selectedItem.category.slice(0, -1)}
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {selectedItem.name || selectedItem.title}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {getItemDetails(selectedItem).map(({ key, value }, index) => (
                  <div
                    key={index}
                    className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30"
                  >
                    <dt className="text-sm text-gray-400 capitalize mb-1">
                      {key.replace(/_/g, " ")}
                    </dt>
                    <dd className="text-white font-medium">
                      {Array.isArray(value) ? value.join(", ") : value}
                    </dd>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!currentData &&
            !loading &&
            !initialLoading &&
            searchQuery.length >= 2 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-400">
                  Aucun résultat trouvé pour "{searchQuery}"
                </p>
              </div>
            )}

          {/* État initial sans données */}
          {!currentData && !loading && !initialLoading && !searchQuery && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-400">
                Utilisez la barre de recherche pour explorer les archives de
                l'Empire
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Authentification Rebelle</h3>
              <button
                onClick={() => setShowAuth(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Nom d'utilisateur
                </label>
                <input
                  type="text"
                  value={credentials.username}
                  onChange={(e) =>
                    setCredentials({ ...credentials, username: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="Luke"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="DadSucks"
                />
              </div>

              <button
                onClick={handleAuth}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white font-medium hover:from-blue-600 hover:to-purple-600 transition-all"
              >
                Authentifier
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-4 text-center">
              Seuls les membres de l'Alliance Rebelle peuvent accéder aux
              données classifiées
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StarWarsApp;
