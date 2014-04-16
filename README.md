# CodeSwarm Worker Balancer

* Standalone process. (may very easily be split into multiple process in the future if needed / 1-1 process connection)

* There are PRODUCERS (ex: codeswarm) and CONSUMERS/WORKERS (ex: worker nodes).

* When a producer connects with a new JOB, balancer will find an available worker and handshake them together until the end of the JOB

* Dockerized, run: "docker build -t codeswarm-balancer ."

### ENV Variables

* PRODUCERS_PORT - producers listening port, defaults to 5000.
* WORKERS_PORT - workers listening port defaults to 8632.

## License Information

This project has been released under the [Apache License, version 2.0](http://www.apache.org/licenses/LICENSE-2.0.html), the text of which is included below. This license applies ONLY to the source of this repository and does not extend to any other CodeSwarm distribution or variant, or any other 3rd party libraries used in a repository. 

> Copyright © 2014 CodeSwarm, Inc.

> Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

> [http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

>  Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
