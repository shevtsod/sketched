import { GraphQLResolveInfo, Kind, SelectionNode } from 'graphql';

export type PrismaArgType = boolean | PrismaArgsType;

export interface PrismaArgsType {
  [key: string]: PrismaArgType;
}

/**
 * Parses the GraphQL resolver info tree and converts it to arguments for a Prisma
 * select query.
 *
 * @param info GraphQL resolver info tree
 * @returns Prisma arguments
 */
export function resolveInfoToPrismaArgs(
  info: GraphQLResolveInfo,
): PrismaArgsType {
  const res: PrismaArgsType = {};
  let root = info.fieldNodes[0];

  // is this record paginated?
  if (
    root.selectionSet?.selections.some(
      (s) =>
        s.kind === Kind.FIELD &&
        ['totalCount', 'pageInfo', 'edges'].includes(s.name.value),
    )
  ) {
    for (const selection of root.selectionSet.selections) {
      if (selection.kind === Kind.FIELD && selection.name.value === 'edges') {
        // find the node
        for (const sub of selection.selectionSet?.selections ?? []) {
          if (sub.kind === Kind.FIELD && sub.name.value === 'node') {
            root = sub;
          }
        }
      }
    }

    // no "node" selection means no args
    if (root === info.fieldNodes[0]) return res;
  }

  const select: PrismaArgsType = {};

  for (const selection of root.selectionSet?.selections ?? []) {
    handleSelection(selection, select);
  }

  if (Object.keys(select).length) {
    res['select'] = select;
  }

  return res;
}

/**
 * Converts a GraphQL selection to a Prisma select query argument and sets it
 * in the given Prisma query object
 *
 * @param selection GraphQL selection object
 * @param select Prisma select object
 */
function handleSelection(selection: SelectionNode, select: PrismaArgsType) {
  if (selection.kind === Kind.FIELD) {
    const name = selection.alias?.value ?? selection.name.value;

    // Skip meta fields
    if (name.startsWith('__')) return;

    // skips relations
    if (selection.selectionSet) return;

    // scalar - select
    select[name] = true;
  }
}
