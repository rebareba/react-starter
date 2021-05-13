const requireAll = (requireContext) => requireContext.keys().map(requireContext)
const req = require.context('.', false, /\.svg$/)
requireAll(req)
