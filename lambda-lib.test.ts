/* eslint-disable @typescript-eslint/no-var-requires */

import { APIGatewayProxyResult } from "aws-lambda";
import { SuperHero } from "../lib/super-hero-types";


describe("The super hero lambda", () => {

    it("should be there", () => {
        const handler = require("../lib/super-hero-lambda.SuperHeroLambda").handler;
        expect(handler).toBeTruthy();
    });

    it("should return existing record", done => {
        const handler = require("../lib/super-hero-lambda.SuperHeroLambda").handler;
        const TEST_DATA = require("../lib/super-heroes.json") as SuperHero[];
        const sample = TEST_DATA[0];
        const event = {
            pathParameters: { "id": sample.id }
        };
        handler(event, null, (error: string | Error | null | undefined, result: APIGatewayProxyResult) => {
            expect(result.statusCode).toBe(200);
            expect(result.body).toBeTruthy();
            const body = JSON.parse(result.body);
            expect(body.length).toBe(1);
            expect(body[0].name).toBe(sample.name);
            done();
        });
    });

    it("should return 404 for non-existing record", done => {
        const handler = require("../lib/super-hero-lambda.SuperHeroLambda").handler;
        const event = {
            pathParameters: { "id": "999" }
        };
        handler(event, null, (error: string | Error | null | undefined, result: APIGatewayProxyResult) => {
            expect(result.statusCode).toBe(404);
            expect(result.body).toBeFalsy();
            done();
        });
    });

    it("should return 400 for malformed request", done => {
        const handler = require("../lib/super-hero-lambda.SuperHeroLambda").handler;
        const event = {
            pathParameters: { "no-use": "123" }
        };
        handler(event, null, (error: string | Error | null | undefined, result: APIGatewayProxyResult) => {
            expect(result.statusCode).toBe(400);
            expect(result.body).toBe("id path parameter missing");
            done();
        });
    });

});