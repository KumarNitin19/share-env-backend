const fetchCollaborators = async (
  githubAccessToken,
  githubUsername,
  githubRepo
) => {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${githubUsername}/${githubRepo}/collaborators`,
      {
        headers: {
          Authorization: `Bearer ${githubAccessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `GitHub API error: ${response.status} ${response.statusText}`
      );
    }

    const collaborators = await response.json();
    return collaborators?.map((user) => user.login);
  } catch (error) {
    console.error("Error fetching collaborators:", error.message);
  }
};

module.exports = { fetchCollaborators };
