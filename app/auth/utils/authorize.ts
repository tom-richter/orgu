import { Ctx, SessionContext } from "blitz"

// custom resolver.authorize
const authorize = () => {
  return function _innerAuthorize(input: unknown, ctx: Ctx) {
    const session: SessionContext = (ctx as any).session
    if (process.env.BLITZ_PUBLIC_AUTHENTICATION_REQUIRED === "true") {
      session.$authorize("ADMIN")
    }
    return {
      __blitz: true,
      value: input,
      ctx: ctx,
    }
  }
}

export default authorize
