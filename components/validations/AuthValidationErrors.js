const AuthValidationErrors = ({ errors = [], ...props }) => {
    errors = Object.values(errors)
    return (
        <>
            {errors.length > 0 && (
                <div {...props}>
                    <ul className="mt-3 list-disc list-inside text-sm text-red-600">
                        {errors.map((error, index) => {
                            return (
                                (
                                    <li key={`e-${index}`}>{error}</li>
                                )
                            )
                        })}
                    </ul>
                </div>
            )}
        </>
    )
}
export default AuthValidationErrors
