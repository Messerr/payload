import { TypeWithID } from '../../config/types';
import { PayloadRequest } from '../../../express/types';
import { Document } from '../../../types';
import findByID from '../findByID';
import { Payload } from '../../..';

export type Options = {
  collection: string
  id: string
  depth?: number
  currentDepth?: number
  locale?: string
  fallbackLocale?: string
  user?: Document
  overrideAccess?: boolean
  showHiddenFields?: boolean
  disableErrors?: boolean
  req?: PayloadRequest
  draft?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function findByIDLocal<T extends TypeWithID = any>(payload: Payload, options: Options): Promise<T> {
  const {
    collection: collectionSlug,
    depth,
    currentDepth,
    id,
    locale,
    fallbackLocale,
    user,
    overrideAccess = true,
    disableErrors = false,
    showHiddenFields,
    req,
    draft = false,
  } = options;

  const collection = payload.collections[collectionSlug];

  const reqToUse = {
    user: undefined,
    ...req || {},
    payloadAPI: 'local',
    locale: locale || req?.locale || payload?.config?.localization?.defaultLocale,
    fallbackLocale: fallbackLocale || req?.fallbackLocale || null,
    payload,
  };

  if (typeof user !== 'undefined') reqToUse.user = user;

  return findByID({
    depth,
    currentDepth,
    id,
    collection,
    overrideAccess,
    disableErrors,
    showHiddenFields,
    req: reqToUse as PayloadRequest,
    draft,
  });
}
