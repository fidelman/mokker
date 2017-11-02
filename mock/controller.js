const queryString = require('query-string');

const queryCondition = ({
    url,
    key,
    reject,
    resolvers
}) => {
    const formatedUrl = url.slice(url.indexOf('?'));
    const actualValue = queryString.parse(formatedUrl)[key];
    let sent = false;
    resolvers.forEach((resolver) => {
        const { value, resolve } = resolver;
        if (actualValue === value.toString()) {
            sent = true;
            resolve();
        }
    });

    if (!sent) reject();
};

module.exports = {
    queryCondition
};