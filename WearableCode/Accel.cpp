#include <node.h>   //Node.js addon Module 헤더

#include <stdio.h>
#include <stdlib.h>
#include <linux/i2c-dev.h>   // Linux 기본 내장 I2C 디바이스 헤드
#include <sys/ioctl.h>      // 시스템 I/O 컨트롤 헤더
#include <fcntl.h>      //I/O 파일 제어를 위한 헤더
#include <unistd.h>     // I2C통신 시 데이터 byte 조작을 위한 헤더


namespace demo {
        using v8::FunctionCallbackInfo;
        //Node.js에서 쓸 콜백객체
        using v8::Local;
        // 지역변수 객체
        using v8::Value;
using v8::Object;
        // 자료형 객체
        int file;
        // I/O File변수
        char *bus = "/dev/i2c-1";
        // I2C에 연결할 Bus 포인터
        char config[2] = {0};
        // 설정값 배열(헥사)
        char reg[1] = {0};
        // 레지스터 주소 배열(헥사)
        char data[1] = {0};
    // I/O데이터 배열(헥사)

    //가속도 X값 반환 함수
        void AccelX(const FunctionCallbackInfo<Value>& args) {
                // Read xAccl lsb data from register(0x28)
                reg[0] = 0x28;
                write(file, reg, 1);
                if(read(file, data, 1) != 1) {
                        printf("Erorr : Input/output Erorr \n");
                        exit(1);
                }
                char data_0 = data[0];
                // Read xAccl msb data from register(0x29)
                reg[0] = 0x29;
                write(file, reg, 1);
                if(read(file, data, 1) != 1) {
                        printf("Erorr : Input/output Erorr \n");
                        exit(1);
                }
                char data_1 = data[0];
                // Convert the data
                int xAccl = (data_1 * 256 + data_0);
                if(xAccl > 32767) {
                        xAccl -= 65536;
                }
                args.GetReturnValue().Set(xAccl);
                //리턴 값 반환
    }
    //가속도 Y값 반환 함수
        void AccelY(const FunctionCallbackInfo<Value>& args) {
               // Read yAccl lsb data from register(0x2A)
                reg[0] = 0x2A;
                write(file, reg, 1);
                if(read(file, data, 1) != 1) {
                        printf("Erorr : Input/output Erorr \n");
                        exit(1);
                }
                char data_2 = data[0];
                // Read yAccl msb data from register(0x2B)
                reg[0] = 0x2B;
                write(file, reg, 1);
                if(read(file, data, 1) != 1) {
                        printf("Erorr : Input/output Erorr \n");
                        exit(1);
                }
                char data_3 = data[0];
                // Convert the data
                int yAccl = (data_3 * 256 + data_2);
                if(yAccl > 32767) {
                        yAccl -= 65536;
                }
                args.GetReturnValue().Set( yAccl); //리턴 값 반환
    }
    //가속도 Z값 반환 함수
        void AccelZ(const FunctionCallbackInfo<Value>& args) {
                // Read zAccl lsb data from register(0x2C)
                reg[0] = 0x2C;
                write(file, reg, 1);
                if(read(file, data, 1) != 1) {
                        printf("Erorr : Input/output Erorr \n");
                        exit(1);
                }
                char data_4 = data[0];
                // Read zAccl msb data from register(0x2D)
                reg[0] = 0x2D;
                write(file, reg, 1);
                if(read(file, data, 1) != 1) {
                        printf("Erorr : Input/output Erorr \n");
                        exit(1);
                }
                char data_5 = data[0];
                // Convert the data
                int zAccl = (data_5 * 256 + data_4);
                if(zAccl > 32767) {
                        zAccl -= 65536;
                }
                args.GetReturnValue().Set( zAccl); //리턴 값 반환
    }
    //자이로 X값 반환 함수
        void GyroX(const FunctionCallbackInfo<Value>& args) {
                // Read xGyro lsb data from register(0x28)
                reg[0] = 0x28;
                write(file, reg, 1);
                if(read(file, data, 1) != 1) {
                        printf("Erorr : Input/output Erorr \n");
                        exit(1);
                }
                char data_0 = data[0];
                // Read xGyro msb data from register(0x29)
                reg[0] = 0x29;
                write(file, reg, 1);
                if(read(file, data, 1) != 1) {
                        printf("Erorr : Input/output Erorr \n");
                        exit(1);
                }
                char data_1 = data[0];
                // Convert the data
                int xGyro = (data_1 * 256 + data_0);
                if(xGyro > 32767) {
                        xGyro -= 65536;
                }
                args.GetReturnValue().Set( xGyro);      //리턴 값 반환
    }
    //자이로 Y값 반환 함수
        void GyroY(const FunctionCallbackInfo<Value>& args) {
                // Read yGyro lsb data from register(0x2A)
                reg[0] = 0x2A;
                write(file, reg, 1);
                if(read(file, data, 1) != 1) {
                        printf("Erorr : Input/output Erorr \n");
                        exit(1);
                }
                char data_2 = data[0];
                // Read yGyro msb data from register(0x2B)
                reg[0] = 0x2B;
                write(file, reg, 1);
                if(read(file, data, 1) != 1) {
                        printf("Erorr : Input/output Erorr \n");
                        exit(1);
                }
                char data_3 = data[0];
                // Convert the data
                int yGyro = (data_3 * 256 + data_2);
                if(yGyro > 32767) {
                        yGyro -= 65536;
                }
                args.GetReturnValue().Set( yGyro);
    }
    //자이로 Z값 반환 함수
        void GyroZ(const FunctionCallbackInfo<Value>& args) {
                // Read zGyro lsb data from register(0x2C)
                reg[0] = 0x2C;
                write(file, reg, 1);
                if(read(file, data, 1) != 1) {
                        printf("Erorr : Input/output Erorr \n");
                        exit(1);
                }
                char data_4 = data[0];
                // Read zGyro msb data from register(0x2D)
                reg[0] = 0x2D;
               write(file, reg, 1);
                if(read(file, data, 1) != 1) {
                        printf("Erorr : Input/output Erorr \n");
                        exit(1);
                }
                char data_5 = data[0];
                // Convert the data
                int zGyro = (data_5 * 256 + data_4);
                if(zGyro > 32767) {
                        zGyro -= 65536;
                }
                args.GetReturnValue().Set( zGyro);
    }
    //지자기 X값 반환 함수
        void MagnX(const FunctionCallbackInfo<Value>& args) {
                // Read xMag lsb data from register(0x08)
                reg[0] = 0x08;
                write(file, reg, 1);
                if(read(file, data, 1) != 1) {
                        printf("Erorr : Input/output Erorr \n");
                        exit(1);
                }
                char data_0 = data[0];
                // Read xMag msb data from register(0x09)
                reg[0] = 0x09;
                write(file, reg, 1);
                if(read(file, data, 1) != 1) {
                        printf("Erorr : Input/output Erorr \n");
                        exit(1);
                }
                char data_1 = data[0];
                // Convert the data
                int xMag = (data_1 * 256 + data_0);
                if(xMag > 32767) {
                        xMag -= 65536;
                }
                args.GetReturnValue().Set( xMag);
    }
    //지자기 Y값 반환 함수
        void MagnY(const FunctionCallbackInfo<Value>& args) {
                // Read yMag lsb data from register(0x0A)
                reg[0] = 0x0A;
                write(file, reg, 1);
                if(read(file, data, 1) != 1) {
                        printf("Erorr : Input/output Erorr \n");
                        exit(1);
                }
                char data_2 = data[0];
                // Read yMag msb data from register(0x0B)
                reg[0] = 0x0B;
                write(file, reg, 1);
                if(read(file, data, 1) != 1) {
                        printf("Erorr : Input/output Erorr \n");
                        exit(1);
                }
              char data_3 = data[0];
                int yMag = (data_3 * 256 + data_2);
                if(yMag > 32767) {
                        yMag -= 65536;
                }
                args.GetReturnValue().Set( yMag);
    }
    //지자기 Z값 반환 함수
        void MagnZ(const FunctionCallbackInfo<Value>& args) {
                // Read zMag lsb data from register(0x0C)
                reg[0] = 0x0C;
                write(file, reg, 1);
                if(read(file, data, 1) != 1) {
                        printf("Erorr : Input/output Erorr \n");
                        exit(1);
                }
                char data_4 = data[0];
                // Read zMag msb data from register(0x0D)
                reg[0] = 0x0D;
                write(file, reg, 1);
                if(read(file, data, 1) != 1) {
                        printf("Erorr : Input/output Erorr \n");
                        exit(1);
                }
                char data_5 = data[0];
                int zMag = (data_5 * 256 + data_4);
                if(zMag > 32767) {
                        zMag -= 65536;
                }
                args.GetReturnValue().Set( zMag);
    }
    //초기화 함수(addon 모듈 로드시 수행)
        void init(Local<Object> exports) {
                // Create I2C bus
                if((file = open(bus, O_RDWR)) < 0) {
                        printf("Failed to open the bus. \n");
                        exit(1);
                }
                // Get I2C device, LSM9DSO GYRO I2C address is 0x6B(107)
                ioctl(file, I2C_SLAVE, 0x6B);
                // Select control register1(0x20)
                // X, Y and Z Axis enable, power on mode, data rate o/p 95 Hz(0x0F)
                config[0] = 0x20;
                config[1] = 0x0F;
                write(file, config, 2);
                // Select control register4(0x23)
                // Full scale 2000 dps, continuous update(0x30)
                config[0] = 0x23;
                config[1] = 0x30;
                write(file, config, 2);
                //  sleep(1);
                // Get I2C device, LSM9DSO Accelero Magneto I2C address is 0x1D(29)
                ioctl(file, I2C_SLAVE, 0x1D);
                // Select control register1(0x20)
                // X, Y and Z Axis enable, power on mode, data rate o/p 100 Hz(0x67)
                config[0] = 0x20;
                config[1] = 0x67;
                write(file, config, 2);
                // Select control register2(0x21)
                // Full scale selection, +/- 16g(0x20)
                config[0] = 0x21;
                config[1] = 0x20;
                write(file, config, 2);
                // Select control register5(0x24)
                // Magnetic high resolution, o/p data rate 50 Hz(0x70)
                config[0] = 0x24;
                config[1] = 0x70;
                write(file, config, 2);
                // Select control register6(0x25)
                // Magnetic full scale selection, +/- 12 gauss(0x60)
                config[0] = 0x25;
                config[1] = 0x60;
                write(file, config, 2);
                // Select control register7(0x26)
                // Normal mode, magnetic continuous conversion mode(0x00)
                config[0] = 0x26;
                config[1] = 0x00;
                write(file, config, 2);
        //   sleep(1);

        //메소드 링크 지정
                NODE_SET_METHOD(exports, "AccelX", AccelX);
                NODE_SET_METHOD(exports, "AccelY", AccelY);
                NODE_SET_METHOD(exports, "AccelZ", AccelZ);
                NODE_SET_METHOD(exports, "GyroX", GyroX);
                NODE_SET_METHOD(exports, "GyroY", GyroY);
                NODE_SET_METHOD(exports, "GyroZ", GyroZ);
                NODE_SET_METHOD(exports, "MagnX", MagnX);
                NODE_SET_METHOD(exports, "MagnY", MagnY);
                NODE_SET_METHOD(exports, "MagnZ", MagnZ);
    }
    //초기화 함수 지정
        NODE_MODULE(NODE_GYP_MODULE_NAME, init)
}
// namespace demo






