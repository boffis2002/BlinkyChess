// Strips any credential field before a user document ever reaches a response.
// Explicitly listing what to drop (rather than only passwordHash) is
// deliberate belt-and-suspenders: users_v2/games_v2 already keep this
// collection isolated from the legacy site's plaintext-password documents,
// this is just a second layer in case that ever changes.
function publicUser(user) {
  const { passwordHash, password, ...rest } = user;
  return rest;
}

module.exports = publicUser;
