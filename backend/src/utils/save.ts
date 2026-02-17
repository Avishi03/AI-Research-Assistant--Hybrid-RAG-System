import Chat from '../models/chat';

const saveMsg = async (
  fuserId: string,
  query: string,
  response: string,
  chatId?: string | null
) => {
  try {
    if (!chatId || chatId === 'null') {
      try {
        const newChat = new Chat({
          fuser: fuserId,
					title: query,
          conversation: [
            {
              isUser: true,
              message: query,
            },
            {
              isUser: false,
              message: response,
            },
          ],
        });
        const savedChat = await newChat.save();
        return savedChat._id;
      } catch (error) {
        console.log(error);
        return null;
      }
    }

    const chat = await Chat.findOne({ _id: chatId, fuser: fuserId });
    if (!chat) {
      return null;
    }

    chat.conversation.push(
      {
        isUser: true,
        message: query,
      },
      {
        isUser: false,
        message: response,
      }
    );
    await chat.save();

    return chat._id;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default saveMsg;
