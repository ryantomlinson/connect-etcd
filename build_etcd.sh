#!/bin/sh

${TRAVIS:?"This is not a Travis build. All Done"}
#Temporal solution to travis issue #155
sudo rm -rf /dev/shm && sudo ln -s /run/shm /dev/shm

wget https://github.com/coreos/etcd/releases/download/v0.4.6/etcd-v0.4.6-linux-amd64.tar.gz
tar -zxvf etcd-v0.4.6-linux-amd64.tar.gz
cd etcd-v0.4.6-linux-amd64
./etcd &

echo "All Done"