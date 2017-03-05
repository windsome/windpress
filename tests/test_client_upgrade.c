/*
 * sudo apt-get install uuid-dev
 * gcc -o uuid uuid.c -luuid
 *
 * 注意： CRC两个字节应该低字节在前，高字节在后，到达服务器后，直接使用crc命令算出为0,表示正确。
 *        文件最大为87.5M，总共两个字节存放packet个数，每个packet是1400byte，故总大小为
 *        0x10000*1400/1024/1024 = 87.5M
 */

#include <netinet/in.h>    // for sockaddr_in
#include <sys/types.h>    // for socket
#include <sys/socket.h>    // for socket
#include <stdio.h>        // for printf
#include <stdlib.h>        // for exit
#include <string.h>        // for bzero
#include <errno.h>
/*
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
*/

#include <uuid/uuid.h>

#define PCK_SIZE 1400
#define BUFFER_SIZE 65536
#define FILE_NAME_MAX_SIZE 512
unsigned char buffer[BUFFER_SIZE];

int version = 2;

char* get_filename () {
    uuid_t uuid;
    char str[36];
    uuid_generate(uuid);
    uuid_unparse(uuid, str);
    char filename[128];
    sprintf(filename, "%s.bin", str);
    return strdup (filename);
}

unsigned short const crc16_table[256] = {  
    0x0000, 0xC0C1, 0xC181, 0x0140, 0xC301, 0x03C0, 0x0280, 0xC241,  
    0xC601, 0x06C0, 0x0780, 0xC741, 0x0500, 0xC5C1, 0xC481, 0x0440,  
    0xCC01, 0x0CC0, 0x0D80, 0xCD41, 0x0F00, 0xCFC1, 0xCE81, 0x0E40,  
    0x0A00, 0xCAC1, 0xCB81, 0x0B40, 0xC901, 0x09C0, 0x0880, 0xC841,  
    0xD801, 0x18C0, 0x1980, 0xD941, 0x1B00, 0xDBC1, 0xDA81, 0x1A40,  
    0x1E00, 0xDEC1, 0xDF81, 0x1F40, 0xDD01, 0x1DC0, 0x1C80, 0xDC41,  
    0x1400, 0xD4C1, 0xD581, 0x1540, 0xD701, 0x17C0, 0x1680, 0xD641,  
    0xD201, 0x12C0, 0x1380, 0xD341, 0x1100, 0xD1C1, 0xD081, 0x1040,  
    0xF001, 0x30C0, 0x3180, 0xF141, 0x3300, 0xF3C1, 0xF281, 0x3240,  
    0x3600, 0xF6C1, 0xF781, 0x3740, 0xF501, 0x35C0, 0x3480, 0xF441,  
    0x3C00, 0xFCC1, 0xFD81, 0x3D40, 0xFF01, 0x3FC0, 0x3E80, 0xFE41,  
    0xFA01, 0x3AC0, 0x3B80, 0xFB41, 0x3900, 0xF9C1, 0xF881, 0x3840,  
    0x2800, 0xE8C1, 0xE981, 0x2940, 0xEB01, 0x2BC0, 0x2A80, 0xEA41,  
    0xEE01, 0x2EC0, 0x2F80, 0xEF41, 0x2D00, 0xEDC1, 0xEC81, 0x2C40,  
    0xE401, 0x24C0, 0x2580, 0xE541, 0x2700, 0xE7C1, 0xE681, 0x2640,  
    0x2200, 0xE2C1, 0xE381, 0x2340, 0xE101, 0x21C0, 0x2080, 0xE041,  
    0xA001, 0x60C0, 0x6180, 0xA141, 0x6300, 0xA3C1, 0xA281, 0x6240,  
    0x6600, 0xA6C1, 0xA781, 0x6740, 0xA501, 0x65C0, 0x6480, 0xA441,  
    0x6C00, 0xACC1, 0xAD81, 0x6D40, 0xAF01, 0x6FC0, 0x6E80, 0xAE41,  
    0xAA01, 0x6AC0, 0x6B80, 0xAB41, 0x6900, 0xA9C1, 0xA881, 0x6840,  
    0x7800, 0xB8C1, 0xB981, 0x7940, 0xBB01, 0x7BC0, 0x7A80, 0xBA41,  
    0xBE01, 0x7EC0, 0x7F80, 0xBF41, 0x7D00, 0xBDC1, 0xBC81, 0x7C40,  
    0xB401, 0x74C0, 0x7580, 0xB541, 0x7700, 0xB7C1, 0xB681, 0x7640,  
    0x7200, 0xB2C1, 0xB381, 0x7340, 0xB101, 0x71C0, 0x7080, 0xB041,  
    0x5000, 0x90C1, 0x9181, 0x5140, 0x9301, 0x53C0, 0x5280, 0x9241,  
    0x9601, 0x56C0, 0x5780, 0x9741, 0x5500, 0x95C1, 0x9481, 0x5440,  
    0x9C01, 0x5CC0, 0x5D80, 0x9D41, 0x5F00, 0x9FC1, 0x9E81, 0x5E40,  
    0x5A00, 0x9AC1, 0x9B81, 0x5B40, 0x9901, 0x59C0, 0x5880, 0x9841,  
    0x8801, 0x48C0, 0x4980, 0x8941, 0x4B00, 0x8BC1, 0x8A81, 0x4A40,  
    0x4E00, 0x8EC1, 0x8F81, 0x4F40, 0x8D01, 0x4DC0, 0x4C80, 0x8C41,  
    0x4400, 0x84C1, 0x8581, 0x4540, 0x8701, 0x47C0, 0x4680, 0x8641,  
    0x8201, 0x42C0, 0x4380, 0x8341, 0x4100, 0x81C1, 0x8081, 0x4040  
};  
  
static unsigned short crc16_byte(unsigned short crc, const unsigned char data)  
{  
    return (crc >> 8) ^ crc16_table[(crc ^ data) & 0xff];  
}  
  
/** 
 * crc16 - compute the CRC-16 for the data buffer 
 * @crc:    previous CRC value 
 * @buffer: data pointer 
 * @len:    number of bytes in the buffer 
 * 
 * Returns the updated CRC value. 
 */  
unsigned short crc16(unsigned short crc, unsigned char const *buffer, size_t len)  
{  
    while (len--)  
        crc = crc16_byte(crc, *buffer++);  
    return crc;  
}  

int cmdBB () {
    buffer[0] = 0xAA;
    buffer[1] = 0x55;
    buffer[2] = 0x01;
    buffer[3] = 0xBB;
    buffer[4] = (version >> 8) & 0xff;
    buffer[5] = version & 0xff;
    unsigned short crcRet = crc16(0,buffer,6);
    buffer[7] = (crcRet >> 8) & 0xff;
    buffer[6] = crcRet & 0xff;
    return 8;
}
int cmdCC () {
    buffer[0] = 0xAA;
    buffer[1] = 0x55;
    buffer[2] = 0x02;
    buffer[3] = 0xCC;
    buffer[4] = (version >> 8) & 0xff;
    buffer[5] = version & 0xff;
    unsigned short crcRet = crc16(0,buffer,6);
    buffer[7] = (crcRet >> 8) & 0xff;
    buffer[6] = crcRet & 0xff;
    return 8;
}
int cmdEE () {
    buffer[0] = 0xAA;
    buffer[1] = 0x55;
    buffer[2] = 0x02;
    buffer[3] = 0xEE;
    buffer[4] = (version >> 8) & 0xff;
    buffer[5] = version & 0xff;
    unsigned short crcRet = crc16(0,buffer,6);
    buffer[7] = (crcRet >> 8) & 0xff;
    buffer[6] = crcRet & 0xff;
    return 8;
}
int sendCmd (int cmd, int sock) {
    int buflen = 0;
    switch (cmd) {
    case 0xBB: 
        buflen = cmdBB ();
        break;
    case 0xCC:
        buflen = cmdCC ();
        break;
    case 0xEE:
        buflen = cmdEE ();
        break;
    }
    /*printf ("T>> ");
    int i = 0;
    for (i = 0; i < buflen; i++) {
        printf ("%02X ", buffer[i]);
    }
    printf ("\n");*/
    send(sock,buffer,buflen,0);
}
int upgradeFile (char* filename, char* addr, int port) {
    //设置一个socket地址结构client_addr,代表客户机internet地址, 端口
    struct sockaddr_in client_addr;
    bzero(&client_addr,sizeof(client_addr)); //把一段内存区的内容全部设置为0
    client_addr.sin_family = AF_INET;    //internet协议族
    client_addr.sin_addr.s_addr = htons(INADDR_ANY);//INADDR_ANY表示自动获取本机地址
    client_addr.sin_port = htons(0);    //0表示让系统自动分配一个空闲端口
    //创建用于internet的流协议(TCP)socket,用client_socket代表客户机socket
    int client_socket = socket(AF_INET,SOCK_STREAM,0);
    if( client_socket < 0)
    {
        printf("Create Socket Failed!\n");
        return -1;
    }
    //把客户机的socket和客户机的socket地址结构联系起来
    if( bind(client_socket,(struct sockaddr*)&client_addr,sizeof(client_addr)))
    {
        printf("Client Bind Port Failed!\n"); 
        return -1;
    }
 
    //设置一个socket地址结构server_addr,代表服务器的internet地址, 端口
    struct sockaddr_in server_addr;
    bzero(&server_addr,sizeof(server_addr));
    server_addr.sin_family = AF_INET;
    if(inet_aton(addr,&server_addr.sin_addr) == 0) //服务器的IP地址来自程序的参数
    {
        printf("Server IP Address Error!\n");
        return -1;
    }
    server_addr.sin_port = htons(port);
    socklen_t server_addr_length = sizeof(server_addr);
    //向服务器发起连接,连接成功后client_socket代表了客户机和服务器的一个socket连接
    if(connect(client_socket,(struct sockaddr*)&server_addr, server_addr_length) < 0)
    {
        printf("Can Not Connect To %s!\n",addr);
        return -1;
    }
 
    FILE * fp = NULL;
    int ret = 0;
    unsigned int totalPktSize = 0;
     
    //向服务器发送buffer中的数据
    printf ("send cmd BB, send version to server! file=%s\n", filename);
    sendCmd(0xBB, client_socket);

    int receiveSize = 0;
    //从服务器接收数据到buffer中
    bzero(buffer,BUFFER_SIZE);
    int length = 0;
    while( length = recv(client_socket,buffer,BUFFER_SIZE,0))
    {
        if(length < 0)
        {
            printf("Recieve Data From Server %s Failed! error=%s\n", addr, strerror(errno));
            //buflen = cmdEE ();
            //send(client_socket,buffer,buflen,0);
            sendCmd(0xEE, client_socket);
            ret = -1;
            break;
        }
        //// dump receive buffer.
        //printf ("R<< ");
        //int i = 0;
        //for (i = 0; i < length; i++) {
        //    printf ("%02X ", buffer[i]);
        //}
        //printf ("\n");

        if (buffer[0] == 0xAA && buffer[1] == 0x55) {
            if (buffer[3] == 0xDD) {
                // prepare to upgrade
                // send ready command.
                //buflen = cmdCC ();
                //send(client_socket,buffer,buflen,0);
                printf ("send CC cmd, prepare ready!\n");
                fp = fopen(filename,"w");
                if(NULL == fp ) {
                    printf("File:\t%s Can Not Open To Write\n", filename);
                    return -1;
                }
                sendCmd(0xCC, client_socket);
                continue;
            }
            if (buffer[3] == 0xEE) {
                // get error. break;
                printf ("get EE cmd, error!\n");
                ret = -2;
                break;
            }
            if (buffer[2] == 3) {
                // get data packet.
                unsigned int count = buffer[3] * 256 + buffer[4];
                unsigned int current = buffer[5] * 256 + buffer[6];
                unsigned int pktSize = buffer[7] * 256 + buffer[8];
                if (totalPktSize < (pktSize + 11)) totalPktSize = pktSize + 11;

                if (pktSize < 11) {
                    printf ("packet is too short! pktSize=%u\n", pktSize);
                    sendCmd(0xEE, client_socket);
                    ret = -3;
                    break;
                }

                // collect a full packet.
                if (length < totalPktSize) {
                    //printf ("not full! length=%u, totalPktSize=%u\n", length, totalPktSize);
                    unsigned int hasRead = length;
                    while(( length = recv(client_socket,buffer + hasRead,(totalPktSize-hasRead),0)) < (totalPktSize-hasRead)) {
                        //printf ("length:%u, hasRead:%u, remain:%u\n", length, hasRead, (totalPktSize-hasRead));
                        hasRead += length;
                    }
                }

                unsigned short crcRet = crc16(0,buffer,totalPktSize);
                //printf ("length=%d, count=%d, current=%d, pktSize=%d, crc:%04x\n", length, count, current, pktSize, crcRet);
                if (crcRet != 0) {
                    printf ("crc error! send EE cmd! current=%u, length=%u, pktSize=%u\n", current, length, pktSize);
                    sendCmd(0xEE, client_socket);
                    ret = -4;
                    break;
                }

                int write_length = fwrite(buffer+9,1,pktSize,fp);
                receiveSize += write_length;
                if (write_length!=pktSize) {
                    printf("File:\t%s Write Failed, pktSize=%d, writeLength=%d, send EE cmd!\n", filename, pktSize,write_length);
                    //buflen = cmdEE ();
                    //send(client_socket,buffer,buflen,0);
                    sendCmd(0xEE, client_socket);
                    ret = -5;
                    break;
                }
                if (current == 0) {
                    printf ("begin  receive file! count=%u(%x), current=%u(%x), pktSize=%u\n", count, count, current, current, pktSize);
                }
                if (current >= (count - 1)) {
                    printf ("finish receive file! count=%u(%x), current=%u(%x), pktSize=%u\n", count, count, current, current, pktSize);
                    ret = 0;
                    break;
                }
                sendCmd(0xCC, client_socket);
                continue;
            }
        } else {
            printf ("not support command! send EE cmd!\n");
            sendCmd(0xEE, client_socket);
        }
    }
    if (length == 0) {
        printf ("receive_length 0? the peer has performed an orderly shutdown, file=%s\n", filename);
        ret = -15;
    }
    printf("Recieve File:\t %s From Server[%s], receive:%d Bytes, ret=%d\n",filename, addr, receiveSize, ret);
     
    if (fp) close(fp);
    //关闭socket
    close(client_socket);
    return ret;
}

int main(int argc, char **argv)
{
    if (argc < 2) {
        printf("Usage: ./%s ServerIPAddress [port] [version]\n",argv[0]);
        exit(1);
    }
    char* filename = get_filename();
    char* addr = argv[1];
    int port = 6969;
    if (argc > 2) port = atoi (argv[2]);
    if (argc > 3) version = atoi (argv[3]);

    while (upgradeFile (filename,  addr, port) != 0) {
        sleep ( random() % 40 + 1 );
    }

    return 0;
}
