import roles from "../data/roles.json";

/**
 * Returns the role of the given Ethereum address.
 * Defaults to "PUBLIC" if not found in roles.json.
 */
const useRole = (account) => {
  if (!account) return "PUBLIC";
  const normalized = account.toLowerCase();
  return roles[normalized] || "PUBLIC";
};

export default useRole;
