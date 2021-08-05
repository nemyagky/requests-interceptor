import {BDRequest} from "../interfaces/bd-request.interface";
import * as sqlite3 from 'sqlite3';
import {Database, open} from 'sqlite';
import * as path from 'path';
import * as sqlString from 'sqlstring';
import {createRequestsDbSql} from "../constants/create-requests-db-sql";

export const RequestsLoggerService = new class RequestsLoggerServiceSingleton {

    private db: Database;

    public async init(): Promise<void> {
        await this.connectDb();
    }

    private async connectDb(): Promise<void> {
        this.db = await open({
            filename: path.join(__dirname, '../../../requests.db'),
            driver: sqlite3.Database
        });

        //await this.db.exec(createRequestsDbSql);
        //await this.db.exec("DELETE FROM requests");

    }

    public logRequest(request: BDRequest): void {
        this.db.run('INSERT INTO requests(pageUrl, method, requestUrl, requestBody, responseBody) VALUES (:pageUrl, :method, :requestUrl, :requestBody, :responseBody)', {
            ':pageUrl': request.pageUrl,
            ':method': request.method,
            ':requestUrl': request.requestUrl,
            ':requestBody': sqlString.escape(request.requestBody),
            ':responseBody': sqlString.escape(request.responseBody)
        })
    }
}