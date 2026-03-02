# Router Adaptation

VuReact provides conversion support for routing components and some APIs, yet manual modifications are still required during integration.

## Mandatory Tasks

1. Ensure `@vureact/router` is installed and configured in the project.
2. Manually verify the routing entry (Provider, history mode, routing table).
3. Validate the behavior of `RouterLink`, `RouterView`, and route guards page by page.

## Why Manual Modifications Are Needed

Routing is an engineering-level context, not a single-file syntax replacement. The compiler can only handle parts that it can statically analyze.

## Further Reading

- VuReact Router Basics: <https://router-vureact.vercel.app/guide/introduction>
- VuReact Router Quick Start: <https://router-vureact.vercel.app/guide/quick-start>
