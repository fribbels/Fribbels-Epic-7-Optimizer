from scapy.all import *
import io,sys,json,os
import threading
import time

acks = [{} for i in range(len(list(conf.ifaces.data.values())))];
existingIpIds = {}
existingTcpSeqs = {}

def try_buffer(currAck, index):
    buffers = index[currAck];

    buffers = sorted(buffers, key=lambda x: x['seq'])
    finalBuffer = b''
    for i in buffers:
        finalBuffer += i['data']


    hexStr = ''
    try:
        hexStr = finalBuffer.hex();
    except:
        hexStr = ''.join(x.encode('hex') for x in finalBuffer);

    print(hexStr);
    print('&');

def check_packet(packet, index):
    if IP in packet:
        if Raw in packet and packet[Raw].load:
            currAck = packet.ack
            currSeq = packet[TCP].seq
            packet_bytes = bytes(packet[Raw].load)

            # packet.show()

            if existingIpIds.get(packet[IP].id) == None:
                existingIpIds[packet[IP].id] = True
            else:
                return

            if existingTcpSeqs.get(packet[TCP].seq) == None:
                existingTcpSeqs[packet[TCP].seq] = True
            else:
                return

            if currAck in acks[index]:
                acks[index][currAck].append({'data': packet_bytes, 'seq': packet[TCP].seq})
            else:
                acks[index][currAck] = [{'data': packet_bytes, 'seq': packet[TCP].seq}]

                # if 'F' in packet[TCP].flags:
                #     try_buffer(currAck)

def thread_sniff(i, index):
    try:
        sniff(iface=i, prn=lambda x: check_packet(x, index), filter="tcp and ( port 3333 )", session=TCPSession)
    except:
        pass

index = 0
for i in list(conf.ifaces.data.values()):
    try:
        x = threading.Thread(target=thread_sniff, args=(i, index,))
        x.daemon = True;
        x.start()

        index = index + 1
    except:
        pass

def terminate():
    os._exit(0)

t = threading.Timer(600.0, terminate)
t.start()

loop = True
while loop:
    line = sys.stdin.readline()
    if "E" in line:
        for index in acks:
            for ack in index:
                try_buffer(ack, index)
        loop = False
        print("DONE\n")
        sys.stdout.flush()