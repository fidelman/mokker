const transformToTernary = (obj) => {
  let ternaryObject = obj;

  if (!('@m_result' in obj)) {
    ternaryObject = {
      '@m_result': obj,
      '@m_docs': {
        merged: {},
        objs: []
      }
    };
  }

  return ternaryObject;
};

const getObj = (iftrueTernary, iffalseTernary) => {
  let result;
  if (!iftrueTernary['@m_docs'].objs.length && !iffalseTernary['@m_docs'].objs.length) {
    result = [].concat(iftrueTernary['@m_result'], iffalseTernary['@m_result']);
  } else if (!iftrueTernary['@m_docs'].objs.length) {
    result = [].concat(iftrueTernary['@m_result'], iffalseTernary['@m_docs'].objs);
  } else if (!iffalseTernary['@m_docs'].objs.length) {
    result = [].concat(iffalseTernary['@m_result'], iftrueTernary['@m_docs'].objs);
  } else {
    result = [].concat(iftrueTernary['@m_docs'].objs, iffalseTernary['@m_docs'].objs);
  }

  return result;
};

export const ternary = ({ condition, iftrue, iffalse }) => {
  const iftrueTernary = transformToTernary(iftrue);
  const iffalseTernary = transformToTernary(iffalse);

  const result = condition ? iftrueTernary['@m_result'] : iffalseTernary['@m_result'];
  const merged = Object.assign({}, iftrueTernary['@m_result'], iffalseTernary['@m_result'], iftrueTernary['@m_docs'].merged, iffalseTernary['@m_docs'].merged);
  const objs = getObj(iftrueTernary, iffalseTernary);

  return {
    '@m_result': result,
    '@m_docs': {
      merged,
      objs
    }
  };
};

export default customContoller => (req, res) => {
  const typeofCustomController = typeof customContoller;
  let response = {};

  if (typeofCustomController === 'function') {
    const { body, params, query } = req;
    const data = { body, params, query };
    const result = customContoller(data, req, res);
    response = '@m_result' in result ? result['@m_result'] : result;
  } else if (typeofCustomController === 'object' && !Array.isArray(customContoller)) {
    response = customContoller;
  } else {
    throw new Error(`Unacceptable type of controller: ${typeofCustomController}. It must be 'object' or 'function'.`);
  }

  res.json(response);
};
