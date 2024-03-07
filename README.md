# Chat Application

Chat application built with [Electron](https://www.electronjs.org/) & [React](https://react.dev/) & [AWS](https://aws.amazon.com/).

## Amazon Web Services - Architecture Diagram

The backend infrastructure of this project is deployed to [Amazon Web Services](https://aws.amazon.com/).

![Application structure](./docs/images/Chat%20Application%20-%20Architecture.png)

## Structure

### Monorepo

This project is a monorepository containing the following packages:

- **infra** - AWS Infrastructure created using [Terraform](https://www.terraform.io/).
- **lambdas** - Source code for our [serverless lambda functions](https://aws.amazon.com/lambda/).
- **mysql** - Changesets for our MYSQL Database using [Liquibase](https://www.liquibase.com/).
- **web** - Chat application source code using [Electron](https://www.electronjs.org/).

## Commands

To build this project on your own you need to setup packages locally. Each section below will cover its own build process.

### Lambdas

To build lambdas and use them on AWS we need to convert them and then pack them into zip.

First of all download dependencies:

```
npx install
```

Then build lambdas using:

```
npx run bundle
```

After typescript files are converted into javascript ones, pack it into zip using:

```
npx run package
```

### Web

To run electron app you need to install dependencies:

```
npx install
```

After that we simply run:

```
npx run start
```

## Deploy mechanism

### Infrastructure - Terraform Cloud

The infrastructure changes are deployed automatically upon merge to the main branch using [Terraform Cloud](https://app.terraform.io).

[Link to the project](https://app.terraform.io/app/mrsheep/workspaces/chat-application)

### Database changesets - GitHub Actions

The database changesets are deployed automatically upon merge to the main branch using [GitHub Actions](https://github.com/features/actions);

[Link to the Publish MYSQL workflow](https://github.com/MrSheep05/chat-application/actions/workflows/mysql_publish.yml).

### Chat - Electron

The chat application is currently not distributed in any automatic way. It needs to be build locally using one of the commands mention in the [Commands](#commands) section.
