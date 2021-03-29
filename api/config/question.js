module.exports.question = {
  repository: {
    smallgame: {
      blobEndpoint: `https://api.github.com/repos/${process.env.GITHUB_SMALLGAME_ORG}/${process.env.GITHUB_SMALLGAME_REPOSITORY}/git/blobs`,
      username: process.env.GITHUB_SMALLGAME_USER,
      password: process.env.GITHUB_SMALLGAME_PASSWORD,
      graphql: {
        url: 'https://api.github.com/graphql',
        query: `{
          repository(owner: "${process.env.GITHUB_SMALLGAME_ORG}", name: "${process.env.GITHUB_SMALLGAME_REPOSITORY}") {
            object(expression: "master:data/index.json") {
              ... on Blob {
                oid
              }
            }
          }
        }`
      }
    }
  }
}
