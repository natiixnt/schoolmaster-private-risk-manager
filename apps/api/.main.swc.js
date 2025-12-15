"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
require("reflect-metadata");
const _core = require("@nestjs/core");
const _appmodule = require("./app.module");
const _common = require("@nestjs/common");
async function bootstrap() {
    // eslint-disable-next-line no-console
    console.log('Starting Schoolmaster API...');
    const app = await _core.NestFactory.create(_appmodule.AppModule, {
        bufferLogs: true
    });
    app.enableCors({
        origin: process.env.FRONTEND_URL?.split(',') ?? [
            'http://localhost:3000'
        ],
        credentials: true
    });
    app.useGlobalPipes(new _common.ValidationPipe({
        whitelist: true,
        forbidUnknownValues: false,
        transform: true
    }));
    const port = process.env.PORT ? Number(process.env.PORT) : 3001;
    await app.listen(port);
    // eslint-disable-next-line no-console
    console.log(`Schoolmaster API listening on http://localhost:${port}`);
}
bootstrap();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcHMvYXBpL3NyYy9tYWluLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAncmVmbGVjdC1tZXRhZGF0YSc7XG5pbXBvcnQgeyBOZXN0RmFjdG9yeSB9IGZyb20gJ0BuZXN0anMvY29yZSc7XG5pbXBvcnQgeyBBcHBNb2R1bGUgfSBmcm9tICcuL2FwcC5tb2R1bGUnO1xuaW1wb3J0IHsgVmFsaWRhdGlvblBpcGUgfSBmcm9tICdAbmVzdGpzL2NvbW1vbic7XG5cbmFzeW5jIGZ1bmN0aW9uIGJvb3RzdHJhcCgpIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgY29uc29sZS5sb2coJ1N0YXJ0aW5nIFNjaG9vbG1hc3RlciBBUEkuLi4nKTtcbiAgY29uc3QgYXBwID0gYXdhaXQgTmVzdEZhY3RvcnkuY3JlYXRlKEFwcE1vZHVsZSwgeyBidWZmZXJMb2dzOiB0cnVlIH0pO1xuXG4gIGFwcC5lbmFibGVDb3JzKHtcbiAgICBvcmlnaW46IHByb2Nlc3MuZW52LkZST05URU5EX1VSTD8uc3BsaXQoJywnKSA/PyBbJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMCddLFxuICAgIGNyZWRlbnRpYWxzOiB0cnVlLFxuICB9KTtcblxuICBhcHAudXNlR2xvYmFsUGlwZXMoXG4gICAgbmV3IFZhbGlkYXRpb25QaXBlKHtcbiAgICAgIHdoaXRlbGlzdDogdHJ1ZSxcbiAgICAgIGZvcmJpZFVua25vd25WYWx1ZXM6IGZhbHNlLFxuICAgICAgdHJhbnNmb3JtOiB0cnVlLFxuICAgIH0pLFxuICApO1xuXG4gIGNvbnN0IHBvcnQgPSBwcm9jZXNzLmVudi5QT1JUID8gTnVtYmVyKHByb2Nlc3MuZW52LlBPUlQpIDogMzAwMTtcbiAgYXdhaXQgYXBwLmxpc3Rlbihwb3J0KTtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgY29uc29sZS5sb2coYFNjaG9vbG1hc3RlciBBUEkgbGlzdGVuaW5nIG9uIGh0dHA6Ly9sb2NhbGhvc3Q6JHtwb3J0fWApO1xufVxuXG5ib290c3RyYXAoKTtcbiJdLCJuYW1lcyI6WyJib290c3RyYXAiLCJjb25zb2xlIiwibG9nIiwiYXBwIiwiTmVzdEZhY3RvcnkiLCJjcmVhdGUiLCJBcHBNb2R1bGUiLCJidWZmZXJMb2dzIiwiZW5hYmxlQ29ycyIsIm9yaWdpbiIsInByb2Nlc3MiLCJlbnYiLCJGUk9OVEVORF9VUkwiLCJzcGxpdCIsImNyZWRlbnRpYWxzIiwidXNlR2xvYmFsUGlwZXMiLCJWYWxpZGF0aW9uUGlwZSIsIndoaXRlbGlzdCIsImZvcmJpZFVua25vd25WYWx1ZXMiLCJ0cmFuc2Zvcm0iLCJwb3J0IiwiUE9SVCIsIk51bWJlciIsImxpc3RlbiJdLCJtYXBwaW5ncyI6Ijs7OztRQUFPO3NCQUNxQjsyQkFDRjt3QkFDSztBQUUvQixlQUFlQTtJQUNiLHNDQUFzQztJQUN0Q0MsUUFBUUMsR0FBRyxDQUFDO0lBQ1osTUFBTUMsTUFBTSxNQUFNQyxpQkFBVyxDQUFDQyxNQUFNLENBQUNDLG9CQUFTLEVBQUU7UUFBRUMsWUFBWTtJQUFLO0lBRW5FSixJQUFJSyxVQUFVLENBQUM7UUFDYkMsUUFBUUMsUUFBUUMsR0FBRyxDQUFDQyxZQUFZLEVBQUVDLE1BQU0sUUFBUTtZQUFDO1NBQXdCO1FBQ3pFQyxhQUFhO0lBQ2Y7SUFFQVgsSUFBSVksY0FBYyxDQUNoQixJQUFJQyxzQkFBYyxDQUFDO1FBQ2pCQyxXQUFXO1FBQ1hDLHFCQUFxQjtRQUNyQkMsV0FBVztJQUNiO0lBR0YsTUFBTUMsT0FBT1YsUUFBUUMsR0FBRyxDQUFDVSxJQUFJLEdBQUdDLE9BQU9aLFFBQVFDLEdBQUcsQ0FBQ1UsSUFBSSxJQUFJO0lBQzNELE1BQU1sQixJQUFJb0IsTUFBTSxDQUFDSDtJQUNqQixzQ0FBc0M7SUFDdENuQixRQUFRQyxHQUFHLENBQUMsQ0FBQywrQ0FBK0MsRUFBRWtCLEtBQUssQ0FBQztBQUN0RTtBQUVBcEIifQ==