const queryString = require('query-string');

export const queryCondition = ({
    req,
    key,
    reject,
    resolvers
}) => {
    const url = req.headers.referer || req.url;

    const formatedUrl = url.slice(url.indexOf('?'));
    const actualValue = queryString.parse(formatedUrl)[key];
    
    const matchedResolver = resolvers.find(resolver => actualValue === resolver.value.toString());

    return matchedResolver ? matchedResolver.resolve : reject;
};

export const mainController = (customContoller) => {
    return (req, res) => {
        const typeofCustomController = typeof customContoller;
        let response = {};

        if (typeofCustomController === 'function') {
            const { body, params, query } = req;
            const data = { body, params, query };
            response = customContoller(data, req, res);
        } else if (typeofCustomController === 'object' && !Array.isArray(customContoller)) {
            response = customContoller;
        } else {
            throw new Error(`Unacceptable type of controller: ${typeofCustomController}. It must be 'object' or 'function'.`);
        }
        
        res.json(response);
    }
};