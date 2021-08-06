import {ProtocolRequest} from 'electron';
import {Buffer} from "buffer";
import {RequestsLoggerService} from "./requests-logger.service";


export const CustomUrlsInterceptorService = new class CustomUrlsInterceptorServiceSingleton {


    public interceptOzonUrl(req: ProtocolRequest, response): boolean {
        if (req.url === 'https://ozon.ru/api/composer-api.bx/_action/summary' ||
            req.url === 'https://www.ozon.ru/api/composer-api.bx/_action/summary') {
            const responseData = this.getOzonUrlFakeData();

            this.logRequest(req, responseData);
            response(Buffer.from(responseData));

            return true;
        }
    }

    private getOzonUrlFakeData(): string {
        const responseData = [];

        for (let i = 0; i < 444; i++) {
            responseData.push({id: i, name: "name", price: i, discountPrice: i, quantity: 1});
        }

        return JSON.stringify(responseData);
    }

    public logRequest(req: ProtocolRequest, responseBody): void {
        RequestsLoggerService.logRequest({
            pageUrl: req.referrer,
            method: req.method,
            requestUrl: req.url,
            requestBody: req.uploadData ? req.uploadData[0]?.bytes?.toString() : '',
            responseBody: responseBody
        });
    }

}