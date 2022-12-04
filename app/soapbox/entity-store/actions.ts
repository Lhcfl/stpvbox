import type { Entity } from './types';

const ENTITIES_IMPORT = 'ENTITIES_IMPORT' as const;
const ENTITIES_FETCH_REQUEST = 'ENTITIES_FETCH_REQUEST' as const;
const ENTITIES_FETCH_SUCCESS = 'ENTITIES_FETCH_SUCCESS' as const;
const ENTITIES_FETCH_FAIL = 'ENTITIES_FETCH_FAIL' as const;

/** Action to import entities into the cache. */
function importEntities(entities: Entity[], entityType: string, listKey?: string) {
  return {
    type: ENTITIES_IMPORT,
    entityType,
    entities,
    listKey,
  };
}

function entitiesFetchRequest(entityType: string, listKey?: string) {
  return {
    type: ENTITIES_FETCH_REQUEST,
    entityType,
    listKey,
  };
}

function entitiesFetchSuccess(entities: Entity[], entityType: string, listKey?: string) {
  return {
    type: ENTITIES_FETCH_SUCCESS,
    entityType,
    entities,
    listKey,
  };
}

function entitiesFetchFail(entityType: string, listKey?: string) {
  return {
    type: ENTITIES_FETCH_FAIL,
    entityType,
    listKey,
  };
}

/** Any action pertaining to entities. */
type EntityAction =
  ReturnType<typeof importEntities>
  | ReturnType<typeof entitiesFetchRequest>
  | ReturnType<typeof entitiesFetchSuccess>
  | ReturnType<typeof entitiesFetchFail>;

export {
  ENTITIES_IMPORT,
  ENTITIES_FETCH_REQUEST,
  ENTITIES_FETCH_SUCCESS,
  ENTITIES_FETCH_FAIL,
  importEntities,
  entitiesFetchRequest,
  entitiesFetchSuccess,
  entitiesFetchFail,
  EntityAction,
};