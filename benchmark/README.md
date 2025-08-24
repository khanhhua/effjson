README
====

## Sample HTTP Server

A simple `node:http` based server with two flavors is used to benchmark *EffJson* scheme. The control group server is started with

```
flavor=classic npm start
```

The server under test:

```
npm start
```

Performance statistics is collected using an external tool Apache Benchmark (ab) with concurrency option of 1, n of 1000. Since we are comparing `EffJson.deflate` with classic `JSON.stringify`, the sample size of 1000 should yield a more statistically reliable value. Each server runs in a separate process independent from the benchmark provider. Although the two takes place on the same multicore CPU, this should give a higher level of consistency in terms of execution environment, especially zero network latency across nodes.

## Apache Bench report

```
ab -q -n 1000 -c 1 http://localhost:8080/10mb
```

### Classic flavor

Document length: 10289563 bytes

```
              min  mean[+/-sd] median   max
Connect:        0    0   0.1      0       1
Processing:    41   44   3.6     44      76
Waiting:       35   37   3.4     37      71
Total:         41   45   3.6     44      76
```


### With EffJson

Document length: 7801781 bytes 
Reduction rate: 0.7582227738923412

```
              min  mean[+/-sd] median   max
Connect:        0    0   0.1      0       0
Processing:    71   74   2.9     74     113
Waiting:       66   70   2.6     69     110
Total:         71   74   2.9     74     113
```

