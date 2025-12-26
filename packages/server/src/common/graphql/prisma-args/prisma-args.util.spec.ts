import { faker } from '@faker-js/faker';
import {
  FieldNode,
  GraphQLResolveInfo,
  Kind,
  NameNode,
  SelectionSetNode,
} from 'graphql';
import { resolveInfoToPrismaArgs } from './prisma-args.util';

function createMockNameNode(overrides?: Partial<NameNode>): NameNode {
  return {
    kind: Kind.NAME,
    value: faker.string.alphanumeric({ length: 10 }),
    ...overrides,
  };
}

function createMockSelectionSet(
  overrides?: Partial<SelectionSetNode>,
): SelectionSetNode {
  return {
    kind: Kind.SELECTION_SET,
    selections: [],
    ...overrides,
  };
}

function createMockFieldNode(overrides?: Partial<FieldNode>): FieldNode {
  return {
    kind: Kind.FIELD,
    name: createMockNameNode(),
    ...overrides,
  };
}

function createMockGraphQLResolveInfo(
  overrides?: Partial<GraphQLResolveInfo>,
): GraphQLResolveInfo {
  const fieldNodes = Array.from({ length: 10 }, createMockFieldNode);

  return {
    fieldName: faker.string.alphanumeric({ length: 10 }),
    fieldNodes,
    ...overrides,
  } as Partial<GraphQLResolveInfo> as GraphQLResolveInfo;
}

describe('prisma-args.util', () => {
  it('selects fields', () => {
    const info = createMockGraphQLResolveInfo({
      fieldNodes: [
        createMockFieldNode({
          selectionSet: createMockSelectionSet({
            selections: [
              createMockFieldNode({
                name: createMockNameNode({ value: 'id' }),
              }),
              createMockFieldNode({
                name: createMockNameNode({ value: 'name' }),
              }),
            ],
          }),
        }),
      ],
    });

    const res = resolveInfoToPrismaArgs(info);
    expect(res).toEqual({
      select: {
        id: true,
        name: true,
      },
    });
  });

  it('skips meta fields', () => {
    const info = createMockGraphQLResolveInfo({
      fieldNodes: [
        createMockFieldNode({
          selectionSet: createMockSelectionSet({
            selections: [
              createMockFieldNode({
                name: createMockNameNode({ value: '__meta' }),
              }),
            ],
          }),
        }),
      ],
    });

    const res = resolveInfoToPrismaArgs(info);
    expect(res).toEqual({
      select: {},
    });
  });

  it('skips relations', () => {
    const info = createMockGraphQLResolveInfo({
      fieldNodes: [
        createMockFieldNode({
          selectionSet: createMockSelectionSet({
            selections: [
              createMockFieldNode({
                name: createMockNameNode({ value: 'relation' }),
                selectionSet: createMockSelectionSet({
                  selections: [
                    createMockFieldNode({
                      name: createMockNameNode({ value: 'name' }),
                    }),
                  ],
                }),
              }),
            ],
          }),
        }),
      ],
    });

    const res = resolveInfoToPrismaArgs(info);
    expect(res).toEqual({
      select: {},
    });
  });

  it('handles paginated records', () => {
    const info = createMockGraphQLResolveInfo({
      fieldNodes: [
        createMockFieldNode({
          selectionSet: createMockSelectionSet({
            selections: [
              createMockFieldNode({
                name: createMockNameNode({ value: 'edges' }),
                selectionSet: createMockSelectionSet({
                  selections: [
                    createMockFieldNode({
                      name: createMockNameNode({ value: 'node' }),
                      selectionSet: createMockSelectionSet({
                        selections: [
                          createMockFieldNode({
                            name: createMockNameNode({ value: 'id' }),
                          }),
                          createMockFieldNode({
                            name: createMockNameNode({ value: 'name' }),
                          }),
                        ],
                      }),
                    }),
                  ],
                }),
              }),
            ],
          }),
        }),
      ],
    });

    const res = resolveInfoToPrismaArgs(info);
    expect(res).toEqual({
      select: {
        id: true,
        name: true,
      },
    });
  });
});
