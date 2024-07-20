import { loginSchema } from "~/routes/_auth.log-in/login-schema.ts";
import { compareSync } from "bcrypt-ts";
import { Authenticator, AuthorizationError } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { fromError } from "zod-validation-error";

import { Contact, singleQuery } from "./db.server.ts";
import { sessionStorage } from "./session.server.ts";

const authenticator = new Authenticator<Contact>(sessionStorage);

authenticator.use(
  new FormStrategy(async ({ form }) => {
    // form.get() returns "baz" and not baz => slicing the quotations
    const email = form.get("email")?.slice(1, -1) as string;
    const password = form.get("password")?.slice(1, -1) as string;
    const result = loginSchema.safeParse({ email, password });
    if (!result.success)
      throw new AuthorizationError(fromError(result.error).toString());
    console.log("********************", email, password);

    const existingUser = (await singleQuery(
      `SELECT * FROM contacts WHERE email = '${email}'`,
    )) as Contact | null;
    console.log(existingUser);
    if (existingUser === null) {
      throw new AuthorizationError("Email doesn't exist");
    }

    const existingPassword = existingUser.password as string;
    console.log(password, existingPassword);
    const passwordMatches: boolean = compareSync(password, existingPassword);
    console.log("*********************", passwordMatches);
    if (!passwordMatches) {
      throw new AuthorizationError("Email or password is invalid");
    }

    return existingUser;
  }),
  "form",
);

export { authenticator };
