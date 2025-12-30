# Routing Matching Syntax

The routing matching syntax of `react-router-dom` is used, which **does not support any regular expression syntax** or **repeatable parameter syntax**. It only supports two wildcard patterns: `:param*` and `*`.

Due to the different underlying designs in terms of routing matching syntax, there is no need to force syntax conversion and grafting at the intermediate level. This would add a lot of unnecessary complexity and may lead to unexpected errors. Therefore, you only need to use the legal syntax provided by react-router-dom.
