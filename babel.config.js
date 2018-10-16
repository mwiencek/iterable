module.exports = function (api) {
  api.cache(false);

  const ignore = [
    'node_modules',
  ];

  const presets = [
    ['@babel/preset-env', {
      targets: {
        ie: '11',
        node: '6',
      },
      useBuiltIns: process.env.NODE_ENV === 'test' ? 'usage' : false,
    }],
    '@babel/preset-flow',
  ];

  return {
    ignore,
    presets,
  };
};
