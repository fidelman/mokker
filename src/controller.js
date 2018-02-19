import { getObjForCnd } from './docs';

export const cnd = ({ condition, iftrue, iffalse }) => {
  let response;
  const docs = getObjForCnd(iftrue, iffalse);
  Object.defineProperty(response, 'docs', { value: docs });

  // if (condition) {
  //     response = {
  //         ...response,
  //         ...(typeof iftrue === 'object' ? iftrue : iftrue())
  //     }
  // }

  // response = {
  //     ...response,
  //     ...(typeof iffalse === 'object' ? iffalse : iffalse())
  // }

  return response;
};

export default customContoller => (req, res) => {
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
};
