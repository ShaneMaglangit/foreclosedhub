import {sayHello} from "@web/lib/grpc/client";

export default async function Home() {
  const resp = await sayHello()

  return (
      <h1>{ resp?.body }</h1>
  )
}
