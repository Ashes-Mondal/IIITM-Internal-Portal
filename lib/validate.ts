import withJoi from 'next-joi'

export const validate = withJoi({
	onValidationError: (_, res) => {
		return res.status(418).json({ data:null,error: "INVALID_REQUEST_PARAMETER" })
	},
})