export async function all(env, sql, bindings = []) {
  const statement = env.DB.prepare(sql);
  const result = await bind(statement, bindings).all();
  return result.results || [];
}

export async function first(env, sql, bindings = []) {
  const statement = env.DB.prepare(sql);
  return bind(statement, bindings).first();
}

export async function run(env, sql, bindings = []) {
  const statement = env.DB.prepare(sql);
  return bind(statement, bindings).run();
}

function bind(statement, bindings) {
  return bindings.length ? statement.bind(...bindings) : statement;
}
