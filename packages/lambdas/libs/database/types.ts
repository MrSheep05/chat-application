export type QueryProcedureFn = ({
  name,
  params,
  outputs,
}: {
  name: string;
  params?: any[];
  outputs?: any[];
}) => Promise<{
  results: any;
  fields: any;
}>;
