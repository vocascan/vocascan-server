# Changelog

This changelog goes through all the changes that have been made in each release on the
[vocascan-server](https://github.com/vocascan/vocascan-server).

## [v1.3.0](https://github.com/vocascan/vocascan-server/releases/tag/v1.3.0) - 2022.06.13

In this version of the vocascan-server, we added the function to prevent unverified users from logging in. You can choose between different modes to adjust the security level of your server directly to your intentions.

- Features
  - Vocabulary-Search in group route (#85)
  - Email verification (#78)
- Refactor
  - Email verification adjustment (#86)
  - Improved run programmatically (#84)

## [v1.2.1](https://github.com/vocascan/vocascan-server/releases/tag/v1.2.1) - 2022.01.29

In this release of vocascan-server we have added new security features to force secure passwords to the users.

- Features
  - Added Password Complexity to register and password reset (#79)
- Bug
  - closes Update Swagger Documentation for password reset (#80) (#81)

## [v1.2.0](https://github.com/vocascan/vocascan-server/releases/tag/v1.2.0) - 2022.01.22

In this release of vocascan-server we have added new features to make your server more secure. On the one hand, the legal side. You can now include static HTML pages or redirects to your privacy policy or imprint. On the other hand, in security, with an improved CORS configuration option to restrict access to only allowed frontend domains.

- Features
  - Feature/legal templates (#72)
- Security
  - CORS (#71)

## [v1.1.1](https://github.com/vocascan/vocascan-server/releases/tag/v1.1.1) - 2021.11.21

In this bug-fixing version the Daily query limit is fixed, which due to a code error, took the date when the server was started.

- Bugfixes
  - Daily query limit (#69)

## [v1.1.0](https://github.com/vocascan/vocascan-server/releases/tag/v1.1.0) - 2021.11.20

After some time, the new version of Vocascan Server has finally been released, with import/export features to share your
vocabulary packages. The new invitation codes will help you to keep your server all to yourself and your friends. We've
included major structural changes, working on a completely new configuration and starting option to make setup even
easier. Therefore we now publish the new CLI as a npm package to [npm](https://www.npmjs.com/package/@vocascan/server)
and the [GitHub Package Registry](https://github.com/vocascan/vocascan-server/packages/1077993). Additionally, there is
now a fully functional and configurable logger. To find out more, it's best to check out our
[documentation](https://docs.vocascan.com/#/vocascan-server/installation). Recently, there are templates for starting
with PM2, Docker or Traefik, which should provide flexibility.

!> Last but not least, we have adjusted the names of the packages. These are now only accessible under
`vocascan/server`, no longer via `vocascan/vocascan-server`.

- Features
  - Vocascan cli (#63)
  - Config logger (#61)
  - Invite codes (#56)
  - Import/Export function (#54)
- Bugfixes
  - Role seeders for MySQL setup (#58)
  - Swagger doc url behind reverse proxy (#55)
  - fixed a bug with daily query limit

## [v1.0.0](https://github.com/vocascan/vocascan-server/releases/tag/v1.0.0) - 2021.06.13

Finally the time has come. The first release of Vocascan is ready. Vocascan is a server-client vocabulary trainer that
is intended to give the user many setting options so that he can adapt it to his personal learning strategies and
habits. All the basic functions of a vocabulary trainer are currently built in, making it fully functional. However,
there are still many more features to come. Due to the data protection guidelines, we cannot yet provide a public
server, which means that you currently have to host it yourself. But we are working as quickly as possible to use the
trainer offline.

- Basic functions
  - Register/Login
  - Change password function
  - Delete user account function
  - Add/modify/delete packages
  - Add/modify/delete groups
  - Add/modify/delete vocabs
  - Get query vocabs
  - Check answer
  - Stats counter for each day
