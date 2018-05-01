const { Conversation, Message } = require('./../models')

exports.getConversations = (req, res, next) => {
  Conversation
    .find({participants: req.user._id})
    .select('_id')
    .exec((err, conversations) => {
      if (err) {
        res.send({error: err})
        return next(err)
      }

      const fullConversations = []
      conversations.forEach(conversation => {
        Message
          .find({conversationId: conversation._id})
          .sort('-createdAt')
          .limit(1)
          .populate({
            path: 'user',
            select: 'username'
          })
          .exec((err, message) => {
            if (err) {
              res.send({error: err})
              return next(err)
            }

            fullConversations.push(message)
            if (fullConversations.length === conversations.length) {
              return res.status(200).json({conversations: fullConversations})
            }
          })
      })
    })
}

exports.getConversation = (req, res, next) => {
  Message
    .find({conversationId: req.params.conversationId})
    .select('createdAt message user')
    .sort('-createdAt')
    .populate({
      path: 'user',
      select: 'username'
    })
    .exec((err, messages) => {
      if (err) {
        res.send({error: err})
        return next(err)
      }

      return res.status(200).json({conversation: messages})
    })
}

exports.newConversation = (req, res, next) => {
  if (!req.params.recipient) {
    res
      .status(422)
      .send({error: 'Por favor, elija un destinatario válido para su mensaje'})
    return next()
  }

  if (!req.body.composedMessage) {
    res
      .status(422)
      .send({error: 'Por favor escribe un mensaje'})
    return next()
  }

  const conversation = new Conversation({
    participants: [req.user._id, req.params.recipient]
  })

  conversation.save((err, newConversation) => {
    if (err) {
      res.send({error: err})
      return next(err)
    }

    const message = new Message({
      conversationId: newConversation._id,
      message: req.body.composedMessage,
      user: req.user._id
    })

    message.save((err, newMessage) => {
      if (err) {
        res.send({error: err})
        return next(err)
      }

      return res.status(200).json({
        message: 'Conversación iniciad',
        conversationId: conversation._id
      })
    })
  })
}

exports.sendReply = (req, res, next) => {
  const reply = new Message({
    conversationId: req.params.conversationId,
    message: req.body.composedMessage,
    user: req.user._id
  })

  reply.save((err, sentReply) => {
    if (err) {
      res.send({error: err})
      return next(err)
    }

    return res.status(200).json({message: 'Respuesta enviada con éxito!'})
  })
}
