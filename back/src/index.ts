import { AppDataSource } from "./data-source"
import fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import { WinpyComponentSource } from "./data/WinpyComponentSource";
import { DBEntityManager } from "./singletons/DbEntityManager";
import { WinpyRepoSingle } from "./singletons/WinpyRepository";
import { RepoHolder } from "./singletons/RepoHolder";
import { ComponentRepositoryImpl } from "./repositories/ComponentRepository";
import { UserRepositoryImpl } from "./repositories/UserRepository";
import { FastifyHolder } from "./singletons/FastifyHolder";
import { UserRepoHolder } from "./singletons/UserRepoHolder";
import ComponentsRoutes from "./routes/ComponentsRoutes";
import UserRoutes from "./routes/UserRoutes";
import ProductRoutes from "./routes/ProductRoutes";

AppDataSource.initialize().then(async () => {


    DBEntityManager.setInstance(AppDataSource.manager);
    WinpyRepoSingle.setInstance(new WinpyComponentSource());
    RepoHolder.setInstance(new ComponentRepositoryImpl());


    const port:number = Number(process.env.PORT ?? 8888);

    const server = fastify()
    server.register(fastifyJwt, {
        secret: "supersecret",
    });

    FastifyHolder.setInstance(server);
    UserRepoHolder.setInstance(new UserRepositoryImpl());


    server.register(UserRoutes, { prefix: '/api/v1/users' });
    server.register(ComponentsRoutes, { prefix: '/api/v1/components' });
    server.register(ProductRoutes, { prefix: '/api/v1/products' });

    server.get("/ping", async (request, reply) => {
        reply.send({text:"Pong!"});
    })


    server.listen({ port }, (err, address) => {
        if (err) {
            console.error(err)
            process.exit(1)
        }
        console.log(`Server listening at ${address}`)
    })

}).catch(error => console.log(error))
