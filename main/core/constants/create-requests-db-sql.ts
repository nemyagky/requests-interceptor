export const createRequestsDbSql =
    `create table requests (
        id INT AUTO_INCREMENT,
        pageUrl TEXT, 
        method TEXT,
        requestUrl TEXT,
        requestBody TEXT,
        responseBody TEXT,
        PRIMARY KEY (ID)
    );`