/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n    fragment compositionComponentNode on CompositionComponentNode {\n        key\n        component {\n            _metadata {\n                types\n            }\n            ...cityElement\n        }\n    }\n": types.CompositionComponentNodeFragmentDoc,
    "\n  query VisualBuilder($url: String) {\n    _Experience(\n      where: { _metadata: { url: { default: { eq: $url } } } }\n    ) {\n      items {\n        composition {\n          grids: nodes {\n            ... on CompositionStructureNode {\n              key\n              displaySettings {\n                key\n                value\n              }\n              rows: nodes {\n                ... on CompositionStructureNode {\n                  key\n                  columns: nodes {\n                    ... on CompositionStructureNode {\n                      key\n                      elements: nodes {\n                        ...compositionComponentNode\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n        _metadata {\n          key\n          version\n        }\n      }\n    }\n  }\n": types.VisualBuilderDocument,
    " \n  query PreviewBuilder($key: String, $version: String) {\n    _Experience(\n      where: {\n        _and: [\n          { _metadata: { key: { eq: $key } } },\n          { _metadata: { version: { eq: $version } } }\n        ]\n      }\n    ) {\n      items {\n        composition {\n          grids: nodes {\n            ... on CompositionStructureNode {\n              key\n              displaySettings {\n                key\n                value\n              }\n              rows: nodes {\n                ... on CompositionStructureNode {\n                  key\n                  columns: nodes {\n                    ... on CompositionStructureNode {\n                      key\n                      elements: nodes {\n                        ...compositionComponentNode\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n        _metadata {\n          key\n          version\n        }\n      }\n    }\n  }\n": types.PreviewBuilderDocument,
    "\n  fragment cityElement on CityBlock {\n    Image {\n        url {\n            default\n        }\n    }\n    Description {\n      html\n    }\n    Title\n  }\n": types.CityElementFragmentDoc,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment compositionComponentNode on CompositionComponentNode {\n        key\n        component {\n            _metadata {\n                types\n            }\n            ...cityElement\n        }\n    }\n"): (typeof documents)["\n    fragment compositionComponentNode on CompositionComponentNode {\n        key\n        component {\n            _metadata {\n                types\n            }\n            ...cityElement\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query VisualBuilder($url: String) {\n    _Experience(\n      where: { _metadata: { url: { default: { eq: $url } } } }\n    ) {\n      items {\n        composition {\n          grids: nodes {\n            ... on CompositionStructureNode {\n              key\n              displaySettings {\n                key\n                value\n              }\n              rows: nodes {\n                ... on CompositionStructureNode {\n                  key\n                  columns: nodes {\n                    ... on CompositionStructureNode {\n                      key\n                      elements: nodes {\n                        ...compositionComponentNode\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n        _metadata {\n          key\n          version\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query VisualBuilder($url: String) {\n    _Experience(\n      where: { _metadata: { url: { default: { eq: $url } } } }\n    ) {\n      items {\n        composition {\n          grids: nodes {\n            ... on CompositionStructureNode {\n              key\n              displaySettings {\n                key\n                value\n              }\n              rows: nodes {\n                ... on CompositionStructureNode {\n                  key\n                  columns: nodes {\n                    ... on CompositionStructureNode {\n                      key\n                      elements: nodes {\n                        ...compositionComponentNode\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n        _metadata {\n          key\n          version\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: " \n  query PreviewBuilder($key: String, $version: String) {\n    _Experience(\n      where: {\n        _and: [\n          { _metadata: { key: { eq: $key } } },\n          { _metadata: { version: { eq: $version } } }\n        ]\n      }\n    ) {\n      items {\n        composition {\n          grids: nodes {\n            ... on CompositionStructureNode {\n              key\n              displaySettings {\n                key\n                value\n              }\n              rows: nodes {\n                ... on CompositionStructureNode {\n                  key\n                  columns: nodes {\n                    ... on CompositionStructureNode {\n                      key\n                      elements: nodes {\n                        ...compositionComponentNode\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n        _metadata {\n          key\n          version\n        }\n      }\n    }\n  }\n"): (typeof documents)[" \n  query PreviewBuilder($key: String, $version: String) {\n    _Experience(\n      where: {\n        _and: [\n          { _metadata: { key: { eq: $key } } },\n          { _metadata: { version: { eq: $version } } }\n        ]\n      }\n    ) {\n      items {\n        composition {\n          grids: nodes {\n            ... on CompositionStructureNode {\n              key\n              displaySettings {\n                key\n                value\n              }\n              rows: nodes {\n                ... on CompositionStructureNode {\n                  key\n                  columns: nodes {\n                    ... on CompositionStructureNode {\n                      key\n                      elements: nodes {\n                        ...compositionComponentNode\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n        _metadata {\n          key\n          version\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment cityElement on CityBlock {\n    Image {\n        url {\n            default\n        }\n    }\n    Description {\n      html\n    }\n    Title\n  }\n"): (typeof documents)["\n  fragment cityElement on CityBlock {\n    Image {\n        url {\n            default\n        }\n    }\n    Description {\n      html\n    }\n    Title\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;