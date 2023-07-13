import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { LazyFramework } from '@h4ad/serverless-adapter/lib/frameworks/lazy';
import { ExpressFramework } from '@h4ad/serverless-adapter/lib/frameworks/express';
import { ServerlessAdapter } from '@h4ad/serverless-adapter';
import { DefaultHandler } from '@h4ad/serverless-adapter/lib/handlers/default';
import { PromiseResolver } from '@h4ad/serverless-adapter/lib/resolvers/promise';
import { ApiGatewayV2Adapter } from '@h4ad/serverless-adapter/lib/adapters/aws';
import { AppModule } from './app.module';

async function bootstrap() {
    const nestApp = await NestFactory.create(AppModule, new ExpressAdapter());

    // we need to wait until it initializes
    await nestApp.init();

    // then we get the instance of http adapter, it will be express
    const app = nestApp.getHttpAdapter().getInstance();

    return app;
}

const expressFramework = new ExpressFramework();
// the initialization of nestjs is asynchronous, so you can use the lazy framework.
const framework = new LazyFramework(expressFramework, bootstrap);

export const handler = ServerlessAdapter.new(null)
    //.setFramework(new ExpressFramework())
    .setFramework(framework)
    .setHandler(new DefaultHandler())
    .setResolver(new PromiseResolver())
    .addAdapter(new ApiGatewayV2Adapter())
    .build();