SHOST=`hostname -s`
exec erl -pa $PWD/ebin $PWD/deps/*/ebin \
 -sname 'matcha'@$SHOST \
 -boot start_sasl \
 -s 'matcha' \
