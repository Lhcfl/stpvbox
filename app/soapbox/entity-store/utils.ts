import type { Entity, EntityStore, EntityList, EntityCache, EntityListState } from './types';

/** Insert the entities into the store. */
const updateStore = (store: EntityStore, entities: Entity[]): EntityStore => {
  return entities.reduce<EntityStore>((store, entity) => {
    store[entity.id] = entity;
    return store;
  }, { ...store });
};

/** Update the list with new entity IDs. */
const updateList = (list: EntityList, entities: Entity[]): EntityList => {
  const newIds = entities.map(entity => entity.id);
  return {
    ...list,
    ids: new Set([...Array.from(list.ids), ...newIds]),
  };
};

/** Create an empty entity cache. */
const createCache = (): EntityCache => ({
  store: {},
  lists: {},
});

/** Create an empty entity list. */
const createList = (): EntityList => ({
  ids: new Set(),
  state: createListState(),
});

/** Create an empty entity list state. */
const createListState = (): EntityListState => ({
  next: undefined,
  prev: undefined,
  fetching: false,
  error: null,
  lastFetchedAt: undefined,
});

export {
  updateStore,
  updateList,
  createCache,
  createList,
  createListState,
};