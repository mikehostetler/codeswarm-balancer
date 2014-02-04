generic-balancer
================
* Standalone process. (may very easily be split into multiple process in the future if needed / 1-1 process connection)

* There are PRODUCERS (ex: vouch) and CONSUMERS/WORKERS (ex: docker nodes).

* When a producer connects with a new JOB, balancer will find an available worker and handshake them together until the end of the JOB (ex: test aKa command spree check remote-test repo).

* Dockerized, run: "docker build -t codeswarm-balancer ."
