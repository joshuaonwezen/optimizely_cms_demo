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
    "\n    fragment compositionElementNode on CompositionElementNode {\n    key\n    element {\n        ...blogElement\n        ...paragraphElement\n        ...headerElement\n        ...footerElement\n    }\n    }\n": types.CompositionElementNodeFragmentDoc,
    "\n  query VisualBuilder($url: String, $key: String, $version: String) {\n    _Experience(\n      where: {\n        _or: [\n          {\n            _and: [\n              { _metadata: { url: { default: { eq: $url } } } },\n              { _metadata: { version: { eq: $version } } }\n            ]\n          },\n          {\n            _and: [\n              { _metadata: { key: { eq: $key } } },\n              { _metadata: { version: { eq: $version } } }\n            ]\n          }\n        ]\n      }\n    ) {\n      items {\n        composition {\n          grids: nodes {\n            ... on CompositionStructureNode {\n              key\n              displaySettings {\n                key\n                value\n              }\n              rows: nodes {\n                ... on CompositionStructureNode {\n                  key\n                  columns: nodes {\n                    ... on CompositionStructureNode {\n                      key\n                      elements: nodes {\n                        ...compositionElementNode\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n        _metadata {\n          key\n          version\n        }\n      }\n    }\n  }\n": types.VisualBuilderDocument,
    "\n  fragment blogElement on BlogElement {\n    Author\n    Image {\n      default\n    }\n    Text {\n      html\n    }\n    Title\n  }\n": types.BlogElementFragmentDoc,
    "\n    fragment footerElement on FooterElement {\n        Text {\n            html\n        }\n    }\n": types.FooterElementFragmentDoc,
    "\n  fragment headerElement on HeaderElement {\n    Logo {\n      html\n    }\n  }\n": types.HeaderElementFragmentDoc,
    "\n    fragment paragraphElement on ParagraphElement {\n        Text {\n            html\n        }\n    }\n": types.ParagraphElementFragmentDoc,
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
export function graphql(source: "\n    fragment compositionElementNode on CompositionElementNode {\n    key\n    element {\n        ...blogElement\n        ...paragraphElement\n        ...headerElement\n        ...footerElement\n    }\n    }\n"): (typeof documents)["\n    fragment compositionElementNode on CompositionElementNode {\n    key\n    element {\n        ...blogElement\n        ...paragraphElement\n        ...headerElement\n        ...footerElement\n    }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query VisualBuilder($url: String, $key: String, $version: String) {\n    _Experience(\n      where: {\n        _or: [\n          {\n            _and: [\n              { _metadata: { url: { default: { eq: $url } } } },\n              { _metadata: { version: { eq: $version } } }\n            ]\n          },\n          {\n            _and: [\n              { _metadata: { key: { eq: $key } } },\n              { _metadata: { version: { eq: $version } } }\n            ]\n          }\n        ]\n      }\n    ) {\n      items {\n        composition {\n          grids: nodes {\n            ... on CompositionStructureNode {\n              key\n              displaySettings {\n                key\n                value\n              }\n              rows: nodes {\n                ... on CompositionStructureNode {\n                  key\n                  columns: nodes {\n                    ... on CompositionStructureNode {\n                      key\n                      elements: nodes {\n                        ...compositionElementNode\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n        _metadata {\n          key\n          version\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query VisualBuilder($url: String, $key: String, $version: String) {\n    _Experience(\n      where: {\n        _or: [\n          {\n            _and: [\n              { _metadata: { url: { default: { eq: $url } } } },\n              { _metadata: { version: { eq: $version } } }\n            ]\n          },\n          {\n            _and: [\n              { _metadata: { key: { eq: $key } } },\n              { _metadata: { version: { eq: $version } } }\n            ]\n          }\n        ]\n      }\n    ) {\n      items {\n        composition {\n          grids: nodes {\n            ... on CompositionStructureNode {\n              key\n              displaySettings {\n                key\n                value\n              }\n              rows: nodes {\n                ... on CompositionStructureNode {\n                  key\n                  columns: nodes {\n                    ... on CompositionStructureNode {\n                      key\n                      elements: nodes {\n                        ...compositionElementNode\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n        _metadata {\n          key\n          version\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment blogElement on BlogElement {\n    Author\n    Image {\n      default\n    }\n    Text {\n      html\n    }\n    Title\n  }\n"): (typeof documents)["\n  fragment blogElement on BlogElement {\n    Author\n    Image {\n      default\n    }\n    Text {\n      html\n    }\n    Title\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment footerElement on FooterElement {\n        Text {\n            html\n        }\n    }\n"): (typeof documents)["\n    fragment footerElement on FooterElement {\n        Text {\n            html\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment headerElement on HeaderElement {\n    Logo {\n      html\n    }\n  }\n"): (typeof documents)["\n  fragment headerElement on HeaderElement {\n    Logo {\n      html\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment paragraphElement on ParagraphElement {\n        Text {\n            html\n        }\n    }\n"): (typeof documents)["\n    fragment paragraphElement on ParagraphElement {\n        Text {\n            html\n        }\n    }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;