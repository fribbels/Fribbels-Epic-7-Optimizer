from scapy.all import *
import io,sys,json
import threading
import time

acks = {}
prevAcks = [-1 for i in range(len(list(conf.ifaces.data.values())))];

def try_buffer(currAck):
    buffers = acks[currAck];

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

            if currAck in acks:
                acks[currAck].append({'data': packet_bytes, 'seq': currSeq})
            else:
                acks[currAck] = [{'data': packet_bytes, 'seq': currSeq}]

            # if 'F' in packet[TCP].flags:
            #     try_buffer(currAck)

def thread_sniff(i, index):
    try:
        sniff(iface=i, prn=lambda x: check_packet(x, index), filter="tcp and ( port 3333 )")
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

loop = True
while loop:
    line = sys.stdin.readline()
    if "E" in line:
        for ack in acks:
            try_buffer(ack)
        loop = False
        print("DONE\n")
        sys.stdout.flush()