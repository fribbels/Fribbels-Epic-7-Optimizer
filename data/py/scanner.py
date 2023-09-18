from scapy.all import *
import io,sys,json,os
import threading
import time


acks = {}
prevAcks = [-1 for i in range(len(list(conf.ifaces.data.values())))];
existingIpIds = {}
existingTcpSeqs = {}
loads = {}

def try_buffer(currAck):
    buffers = acks[currAck];

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

def check_packet(packet):
    if IP in packet:
        if Raw in packet and packet[Raw].load:
            currAck = packet.ack
            currSeq = packet[TCP].seq
            packet_bytes = bytes(packet[Raw].load)

            # packet.show()

            # if existingIpIds.get(packet[IP].id) == None:
            #     existingIpIds[packet[IP].id] = True
            # else:
            #     return

            # if existingTcpSeqs.get(packet[TCP].seq) == None:
            #     existingTcpSeqs[packet[TCP].seq] = True
            # else:
            #     return

            if packet_bytes.hex() in loads:
                return
            else:
                loads[packet_bytes.hex()] = True

            if currAck in acks:
                acks[currAck].append({'data': packet_bytes, 'seq': packet[TCP].seq})
            else:
                acks[currAck] = [{'data': packet_bytes, 'seq': packet[TCP].seq}]

                # if 'F' in packet[TCP].flags:
                #     try_buffer(currAck)

def terminate():
    os._exit(0)

def thread_sniff():
    try:
        # EpicSeven traffic was confirmed to travel over tcp port 3333 via Wireshark
        # Omitting sniff() iface parameter to force all interfaces to be sniffed.
        # This may lead to more processing but prevents needing to specify an network interface manually in some cases.
        sniff(prn=lambda x: check_packet(x), filter="tcp and ( port 5222 or port 3333 )", session=TCPSession)
    except:
        pass

x = threading.Thread(target=thread_sniff)
x.daemon = True;
x.start()

t = threading.Timer(3600.0, terminate)
t.start()

loop = True
while loop:
    line = sys.stdin.readline()
    if "E" in line:
        for ack in list(acks):
            try_buffer(ack)
        loop = False
        print("DONE\n")
        sys.stdout.flush()