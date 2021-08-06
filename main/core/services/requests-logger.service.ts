import {app} from 'electron';
import * as sqlite3 from 'sqlite3';
import * as path from 'path';
import * as sqlString from 'sqlstring';
import * as fs from "fs";
import {Database, open} from 'sqlite';
import {DBRequest} from "../interfaces/db-request.interface";
import {createRequestsDbSql} from "../constants/create-requests-db-sql";

export const RequestsLoggerService = new class RequestsLoggerServiceSingleton {

    private db: Database;

    public async connectDb(): Promise<void> {
        if (fs.existsSync(this.getDBPath())) {
            await this.openDBConnection();
        } else {
            await this.openDBConnection();
            try {
                await this.db.exec(createRequestsDbSql);
            } catch (e) {
                console.log(e)
            }
        }
    }

    private async openDBConnection(): Promise<void> {
        this.db = await open({
            filename: app.getAppPath(),
            driver: sqlite3.Database
        });
    }

    public logRequest(request: DBRequest): void {
        this.db.run('INSERT INTO requests(pageUrl, method, requestUrl, requestBody, responseBody) VALUES (:pageUrl, :method, :requestUrl, :requestBody, :responseBody)', {
            ':pageUrl': request.pageUrl,
            ':method': request.method,
            ':requestUrl': request.requestUrl,
            ':requestBody': sqlString.escape(request.requestBody),
            ':responseBody': sqlString.escape(request.responseBody)
        })
    }

    private getDBPath(): string {
        return path.join(app.getAppPath(), 'requests.db')
    }
}