cmd_Release/obj.target/accel.node := g++ -shared -pthread -rdynamic  -Wl,-soname=accel.node -o Release/obj.target/accel.node -Wl,--start-group Release/obj.target/accel/Accel.o -Wl,--end-group 
