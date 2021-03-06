-module(matcha_lib).
-author("aklymchuk").

%% API
-export([gv/2, gv/3,
         rand_str/1,
         send_email/3,
         md5/1,
         conv_locaction/1]).

% Notifications
-export([subscribe/1,
         is_subscribed/1,
         send_notification/2]).

-define(EMAIL_SENDER, <<"Matcha">>).
-define(EMAIL_OPTS, [
    {relay, <<"smtp.gmail.com">>},
    {username, <<"malayamanyanya@gmail.com">>},
    {password, <<"33cats44dogs">>}
]).

gv(K, T) -> gv(K, T, null).

gv(K, M, D) when is_map(M) -> maps:get(K, M, D);
gv(K, L, D) when is_list(L) ->
  case lists:keyfind(K, 1, L) of
    {K, V} -> V;
    false -> D
  end.

-spec rand_str(Bytes::non_neg_integer()) -> binary().
rand_str(Bytes) -> encode62(crypto:strong_rand_bytes(Bytes)).

-spec send_email(Subject::binary(), Body::binary(), Receiver::binary()) -> binary().
send_email(Subject, Body, Receiver) ->
    Mimemail =
        {<<"text">>, <<"html">>,
         [{<<"From">>, ?EMAIL_SENDER},
          {<<"To">>, Receiver},
          {<<"Subject">>, Subject},
          {<<"Content-Type">>, <<"text/html; charset=utf-8">>}],
         [{<<"transfer-encoding">>, <<"base64">>}], Body},
    Mail = {?EMAIL_SENDER, [Receiver], mimemail:encode(Mimemail)},
    gen_smtp_client:send_blocking(Mail, ?EMAIL_OPTS).

md5(Content) -> iolist_to_binary([if N < 10 -> N + 48; true -> N + 87 end || <<N:4>> <= erlang:md5(Content)]).

conv_locaction(P) -> maps:update_with(<<"location">>, fun({Lat, Lng}) -> #{lat => Lat, lng => Lng};
							  (null) -> null
						      end, P).

subscribe(Uname) ->
    gproc:reg({p, l, Uname}),
    ok.

is_subscribed(UId) -> gproc:lookup_local_properties(UId) =/= [].

send_notification(UId, Msg) ->
    gproc:send({p, l, UId}, Msg),
    ok.

% Inner functions

encode62(<<_/binary>> = B) -> encode62(B, <<>>).
encode62(<<>>, R) -> R;
encode62(<<B, Rest/binary>>, Acc) -> encode62(Rest, <<Acc/binary, (nthchar(B rem 62))>>).

nthchar(N) when N =< 9 -> $0 + N;
nthchar(N) when N =< 35 -> $A +N - 10;
nthchar(N) -> $a + N - 36.
