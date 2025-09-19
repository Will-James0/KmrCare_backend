/* eslint-disable no-undef */
/**
 * Middleware de logging pour les stores Zustand
 * Permet de tracer les changements d'état pour le debugging
 */

/**
 * Middleware de logging avancé pour Zustand
 * @param {Function} config - Configuration du store
 * @param {Object} options - Options du logger
 * @returns {Function} Store configuré avec logging
 */
export const logger = (config, options = {}) => (set, get, api) => {
  const {
    enabled = process.env.NODE_ENV === 'development',
    collapsed = true,
    filter = () => true,
    transformer = (state) => state,
    colorize = true,
    timestamp = true,
    diff = true,
    storeName = 'Store'
  } = options;

  if (!enabled) {
    return config(set, get, api);
  }

  const logAction = (actionName, prevState, nextState, args = []) => {
    if (!filter(actionName, prevState, nextState)) {
      return;
    }

    const logStyles = {
      action: colorize ? 'color: #03A9F4; font-weight: bold;' : '',
      prevState: colorize ? 'color: #9E9E9E; font-weight: bold;' : '',
      nextState: colorize ? 'color: #4CAF50; font-weight: bold;' : '',
      diff: colorize ? 'color: #FF9800; font-weight: bold;' : '',
      timestamp: colorize ? 'color: #795548; font-weight: normal;' : ''
    };

    const timestampStr = timestamp ? ` @ ${new Date().toLocaleTimeString()}` : '';
    const groupName = `🏪 ${storeName} - ${actionName}${timestampStr}`;

    if (collapsed) {
      console.groupCollapsed(groupName);
    } else {
      console.group(groupName);
    }

    // Action et arguments
    console.log(`%c🎯 Action:`, logStyles.action, actionName);
    if (args.length > 0) {
      console.log(`%c📦 Arguments:`, logStyles.action, args);
    }

    // État précédent
    console.log(`%c⬇️ État précédent:`, logStyles.prevState, transformer(prevState));

    // État suivant
    console.log(`%c⬆️ Nouvel état:`, logStyles.nextState, transformer(nextState));

    // Différences (si activé)
    if (diff) {
      const differences = getDifferences(prevState, nextState);
      if (differences.length > 0) {
        console.log(`%c🔄 Changements:`, logStyles.diff, differences);
      }
    }

    console.groupEnd();
  };

  return config(
    (...args) => {
      const prevState = get();
      
      // Intercepter le nom de l'action depuis la stack trace
      const actionName = getActionName();
      
      set(...args);
      
      const nextState = get();
      logAction(actionName, prevState, nextState, args);
    },
    get,
    api
  );
};

/**
 * Obtient le nom de l'action depuis la stack trace
 */
const getActionName = () => {
  const stack = new Error().stack;
  const lines = stack.split('\n');
  
  // Chercher la ligne qui contient l'appel à l'action du store
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('useAuth') || line.includes('useUI') || 
        line.includes('useNotifications') || line.includes('useData') || 
        line.includes('usePreferences')) {
      const match = line.match(/at\s+(\w+)/);
      return match ? match[1] : 'unknown';
    }
  }
  
  return 'unknown';
};

/**
 * Compare deux objets et retourne les différences
 */
const getDifferences = (prev, next) => {
  const differences = [];
  
  const compare = (obj1, obj2, path = '') => {
    for (const key in obj2) {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (!(key in obj1)) {
        differences.push({
          type: 'added',
          path: currentPath,
          value: obj2[key]
        });
      } else if (obj1[key] !== obj2[key]) {
        if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object' && 
            obj1[key] !== null && obj2[key] !== null) {
          compare(obj1[key], obj2[key], currentPath);
        } else {
          differences.push({
            type: 'changed',
            path: currentPath,
            from: obj1[key],
            to: obj2[key]
          });
        }
      }
    }
    
    for (const key in obj1) {
      const currentPath = path ? `${path}.${key}` : key;
      if (!(key in obj2)) {
        differences.push({
          type: 'removed',
          path: currentPath,
          value: obj1[key]
        });
      }
    }
  };
  
  compare(prev, next);
  return differences;
};

/**
 * Middleware de performance pour mesurer les temps d'exécution
 */
export const performance = (config, options = {}) => (set, get, api) => {
  const {
    enabled = process.env.NODE_ENV === 'development',
    threshold = 10, // ms
    storeName = 'Store'
  } = options;

  if (!enabled) {
    return config(set, get, api);
  }

  return config(
    (...args) => {
      const startTime = performance.now();
      
      set(...args);
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (duration > threshold) {
        console.warn(
          `⚠️ ${storeName} - Action lente détectée: ${duration.toFixed(2)}ms (seuil: ${threshold}ms)`
        );
      }
    },
    get,
    api
  );
};

/**
 * Middleware pour persister certaines parties du state
 */
export const persist = (config, options = {}) => (set, get, api) => {
  const {
    key,
    storage = localStorage,
    partialize = (state) => state,
    serialize = JSON.stringify,
    deserialize = JSON.parse,
    whitelist,
    blacklist
  } = options;

  let persistedState = {};
  
  try {
    const stored = storage.getItem(key);
    if (stored) {
      persistedState = deserialize(stored);
    }
  } catch (error) {
    console.error(`Erreur lors du chargement du state persisté pour ${key}:`, error);
  }

  const store = config(
    (...args) => {
      set(...args);
      
      // Sauvegarder le state après chaque changement
      try {
        const state = get();
        let stateToSave = partialize(state);
        
        // Appliquer whitelist/blacklist
        if (whitelist) {
          stateToSave = Object.keys(stateToSave)
            .filter(key => whitelist.includes(key))
            .reduce((obj, key) => {
              obj[key] = stateToSave[key];
              return obj;
            }, {});
        }
        
        if (blacklist) {
          stateToSave = Object.keys(stateToSave)
            .filter(key => !blacklist.includes(key))
            .reduce((obj, key) => {
              obj[key] = stateToSave[key];
              return obj;
            }, {});
        }
        
        storage.setItem(key, serialize(stateToSave));
      } catch (error) {
        console.error(`Erreur lors de la sauvegarde du state pour ${key}:`, error);
      }
    },
    get,
    api
  );

  // Merger le state persisté avec le state initial
  set(persistedState);
  
  return store;
};

/**
 * Composition de middlewares
 */
export const compose = (...middlewares) => (config) => {
  return middlewares.reduceRight((acc, middleware) => middleware(acc), config);
};

// Exports des middlewares prêts à l'emploi
export const withLogger = (storeName) => (config) => 
  logger(config, { storeName, collapsed: true });

export const withPerformance = (storeName, threshold = 10) => (config) => 
  performance(config, { storeName, threshold });

export const withPersistence = (key, options = {}) => (config) => 
  persist(config, { key, ...options });

// Middleware complet pour stores de production
export const withFullMonitoring = (storeName, persistKey) => compose(
  withLogger(storeName),
  withPerformance(storeName),
  persistKey ? withPersistence(persistKey) : (config) => config
);
