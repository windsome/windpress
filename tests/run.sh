COUNT=100
if [ $# -gt 0 ];then
    COUNT=$1
fi
I=1
while [ $I -le $COUNT ]; do
#    ./a.out 121.42.167.160 &
    ./a.out 127.0.0.1 &
    I=$(($I+1))
    d=$(echo "$RANDOM" | awk '{print 1213.12/$1}')

    sleep $d
done

echo "done!"

